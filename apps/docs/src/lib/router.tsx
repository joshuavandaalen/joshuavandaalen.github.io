import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react';

/**
 * A minimal history-API router.
 *
 * A dependency would be reasonable here, but the codebase already prefers
 * writing the small thing over installing the large one (`cx` rather than
 * `clsx`), and this site's routing needs are a path match and a link. Clean
 * URLs work on static hosting because the deploy copies `index.html` to
 * `404.html` — the standard GitHub Pages SPA fallback.
 */

interface RouterValue {
  path: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterValue>({
  path: '/',
  navigate: () => {},
});

function currentPath(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname || '/';
}

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback(
    (to: string, { replace = false }: { replace?: boolean } = {}) => {
      if (to === window.location.pathname) return;
      window.history[replace ? 'replaceState' : 'pushState']({}, '', to);
      setPath(to);
      // A fresh page starts at the top; the browser only restores scroll for
      // real navigations, not pushState.
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    },
    [],
  );

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

export function useRouter(): RouterValue {
  return useContext(RouterContext);
}

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
}

/**
 * An in-app link. Falls back to normal navigation for external URLs, and for
 * any modified click — a middle-click or ⌘-click must still open a new tab.
 */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const isExternal = /^([a-z]+:)?\/\//i.test(to) || to.startsWith('mailto:');

  if (isExternal) {
    return (
      <a href={to} rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={to}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }
        event.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Matches `/components/:name`-style patterns, returning captured params. */
export function matchRoute(
  pattern: string,
  path: string,
): Record<string, string> | null {
  const patternParts = pattern.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const p = patternParts[i]!;
    const actual = pathParts[i]!;
    if (p.startsWith(':')) {
      params[p.slice(1)] = decodeURIComponent(actual);
    } else if (p !== actual) {
      return null;
    }
  }
  return params;
}
