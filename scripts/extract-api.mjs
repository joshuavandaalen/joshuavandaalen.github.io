#!/usr/bin/env node
/**
 * Generates the docs site's API reference from the kit's TypeScript source.
 *
 * Hand-written props tables go stale the first time somebody renames a prop,
 * and nothing catches it. This reads the real interfaces instead — names,
 * types, optionality, JSDoc, the `extends` clause, and default values pulled
 * out of each component's parameter destructuring (resolving identifiers back
 * to their literals, so `PX_PER_TICK_DEFAULT` shows as `6`).
 *
 * The output is committed. CI re-runs this and fails if the result differs,
 * which is what makes drift structurally impossible rather than merely
 * discouraged.
 *
 *   node scripts/extract-api.mjs [--check]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const kitSrc = join(repoRoot, 'packages/retro-ui/src');
const outFile = join(repoRoot, 'apps/docs/src/generated/api.json');

const checkOnly = process.argv.includes('--check');

/** Every .ts/.tsx under the kit's src, excluding tests and stories. */
function sourceFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      sourceFiles(full, acc);
    } else if (
      /\.tsx?$/.test(entry) &&
      !/\.(test|stories)\.tsx?$/.test(entry) &&
      !entry.endsWith('.d.ts')
    ) {
      acc.push(full);
    }
  }
  return acc;
}

/** JSDoc text for a node, flattened to a single string. */
function docFor(node) {
  const parts = [];
  for (const doc of ts.getJSDocCommentsAndTags(node)) {
    if (typeof doc.comment === 'string') {
      parts.push(doc.comment);
    } else if (Array.isArray(doc.comment)) {
      parts.push(doc.comment.map((c) => c.text ?? '').join(''));
    }
  }
  return parts.join('\n').trim();
}

/** Collapses a type node to readable one-line text. */
function typeText(node, source) {
  if (!node) return 'unknown';
  return node.getText(source).replace(/\s+/g, ' ').trim();
}

function extractFromFile(file) {
  const source = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  // Module-level consts, so `foo = SOME_DEFAULT` can be resolved to its value.
  const moduleConsts = new Map();
  ts.forEachChild(source, (node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.initializer) {
        const text = decl.initializer.getText(source).replace(/\s+/g, ' ');
        // Only worth resolving when it is a simple literal.
        if (text.length <= 60) moduleConsts.set(decl.name.text, text);
      }
    }
  });

  // Defaults live in the component's destructured first parameter.
  const defaults = new Map();
  const collectDefaults = (node) => {
    const isFn =
      ts.isFunctionDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node);

    if (isFn && node.parameters.length > 0) {
      const first = node.parameters[0];
      if (first && ts.isObjectBindingPattern(first.name)) {
        for (const element of first.name.elements) {
          if (!element.initializer) continue;
          const raw = element.initializer.getText(source).replace(/\s+/g, ' ');
          defaults.set(
            element.name.getText(source),
            moduleConsts.get(raw) ?? raw,
          );
        }
      }
    }
    ts.forEachChild(node, collectDefaults);
  };
  collectDefaults(source);

  const interfaces = [];
  const typeAliases = [];

  const visit = (node) => {
    if (ts.isInterfaceDeclaration(node) && node.name.text.endsWith('Props')) {
      const props = [];
      for (const member of node.members) {
        if (!ts.isPropertySignature(member)) continue;
        const name = member.name.getText(source);
        props.push({
          name,
          type: typeText(member.type, source),
          required: !member.questionToken,
          description: docFor(member),
          default: defaults.get(name) ?? null,
        });
      }

      interfaces.push({
        name: node.name.text,
        description: docFor(node),
        extends:
          node.heritageClauses?.flatMap((clause) =>
            clause.types.map((t) => typeText(t, source)),
          ) ?? [],
        props,
        file: relative(repoRoot, file),
      });
    }

    // Union aliases are worth surfacing — `MarqueeBehavior` in a props table
    // is meaningless without its members.
    if (ts.isTypeAliasDeclaration(node)) {
      const text = typeText(node.type, source);
      if (text.includes('|') && text.length < 200) {
        typeAliases.push({
          name: node.name.text,
          type: text,
          description: docFor(node),
        });
      }
    }

    ts.forEachChild(node, visit);
  };
  visit(source);

  return { interfaces, typeAliases };
}

const files = sourceFiles(kitSrc);
const allInterfaces = [];
const allAliases = [];

for (const file of files) {
  const { interfaces, typeAliases } = extractFromFile(file);
  allInterfaces.push(...interfaces);
  allAliases.push(...typeAliases);
}

// Deterministic ordering, so a regeneration never produces a spurious diff.
allInterfaces.sort((a, b) => a.name.localeCompare(b.name));
allAliases.sort((a, b) => a.name.localeCompare(b.name));

const payload = {
  // A note for anyone who opens the file wondering whether to edit it.
  $generated: 'scripts/extract-api.mjs — do not edit by hand',
  interfaces: allInterfaces,
  typeAliases: dedupe(allAliases),
};

function dedupe(aliases) {
  const seen = new Map();
  for (const alias of aliases) if (!seen.has(alias.name)) seen.set(alias.name, alias);
  return [...seen.values()];
}

const serialised = `${JSON.stringify(payload, null, 2)}\n`;

if (checkOnly) {
  const current = existsSync(outFile) ? readFileSync(outFile, 'utf8') : '';
  if (current !== serialised) {
    console.error(
      'ERROR: apps/docs/src/generated/api.json is stale.\n' +
        'The kit’s props changed without the docs being regenerated.\n' +
        'Run: node scripts/extract-api.mjs',
    );
    process.exit(1);
  }
  console.log(
    `api.json is up to date (${allInterfaces.length} interfaces, ${payload.typeAliases.length} type aliases).`,
  );
} else {
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, serialised, 'utf8');
  const propCount = allInterfaces.reduce((n, i) => n + i.props.length, 0);
  console.log(
    `Wrote ${relative(repoRoot, outFile)}: ${allInterfaces.length} interfaces, ` +
      `${propCount} props, ${payload.typeAliases.length} type aliases.`,
  );
}
