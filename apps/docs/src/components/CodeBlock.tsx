import { useCallback, useEffect, useState } from 'react';

import { tokenize } from '../lib/highlight';

/** Copies text, reporting whether it worked so the UI never lies. */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Clipboard is permission-gated and unavailable over plain HTTP; fall
    // through to the legacy path rather than failing silently.
  }

  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/** Copy button with a transient confirmation. */
export function CopyButton({
  text,
  className,
  label = 'Copy',
  copiedClassName,
}: {
  text: string;
  className: string;
  copiedClassName: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const onCopy = useCallback(async () => {
    if (await copyText(text)) setCopied(true);
  }, [text]);

  return (
    <button
      type="button"
      className={copied ? `${className} ${copiedClassName}` : className}
      onClick={onCopy}
    >
      {copied ? '✓ Copied' : label}
      <span className="docs-visually-hidden">
        {copied ? ' to clipboard' : ' code to clipboard'}
      </span>
    </button>
  );
}

export interface CodeBlockProps {
  code: string;
  /** Shown to assistive tech so the block is not an unlabelled wall of text. */
  label?: string;
  copyable?: boolean;
}

export function CodeBlock({
  code,
  label = 'Code example',
  copyable = true,
}: CodeBlockProps) {
  const tokens = tokenize(code);

  return (
    <div className="docs-code">
      {copyable && (
        <CopyButton
          text={code}
          className="docs-code__copy"
          copiedClassName="docs-code__copy--copied"
        />
      )}
      <pre tabIndex={0} role="region" aria-label={label}>
        <code>
          {tokens.map((token, index) =>
            token.kind === 'plain' ? (
              <span key={index}>{token.value}</span>
            ) : (
              <span key={index} className={`docs-tok-${token.kind}`}>
                {token.value}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  );
}
