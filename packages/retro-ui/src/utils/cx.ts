/**
 * Minimal class-name joiner.
 *
 * Deliberately not a dependency: the kit needs exactly this much of `clsx`,
 * and a UI library should not push a transitive install onto consumers for
 * eleven lines of code.
 */
export function cx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(' ');
}
