import { useEffect } from 'react';

import { PlainLayout, SidebarLayout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { ComponentPage, ComponentsIndex } from './pages/ComponentPage';
import {
  Accessibility,
  Installation,
  NotFound,
  Theming,
  WithoutReact,
} from './pages/Guides';
import { Home } from './pages/Home';
import { findComponent } from './content/catalog';
import { matchRoute, useRouter } from './lib/router';
import { DESCRIPTION, PRODUCT_NAME } from './content/meta';

interface Resolved {
  title: string;
  description: string;
  element: JSX.Element;
  layout: 'plain' | 'sidebar';
}

function resolve(path: string): Resolved {
  if (path === '/' || path === '') {
    return {
      title: `${PRODUCT_NAME} — a component library for the early internet`,
      description: DESCRIPTION,
      element: <Home />,
      layout: 'plain',
    };
  }

  const guides: Record<string, Omit<Resolved, 'layout'>> = {
    '/docs/installation': {
      title: `Installation — ${PRODUCT_NAME}`,
      description: `Install ${PRODUCT_NAME}, import the stylesheet, and render your first component.`,
      element: <Installation />,
    },
    '/docs/theming': {
      title: `Theming & tokens — ${PRODUCT_NAME}`,
      description:
        'Override the palette, bevels and motion scale through CSS custom properties.',
      element: <Theming />,
    },
    '/docs/accessibility': {
      title: `Accessibility — ${PRODUCT_NAME}`,
      description:
        'The reduced-motion policy, what was fixed from the original site, and the known limits.',
      element: <Accessibility />,
    },
    '/docs/without-react': {
      title: `Using it without React — ${PRODUCT_NAME}`,
      description:
        'The stylesheet is a standalone design system with BEM class names.',
      element: <WithoutReact />,
    },
  };

  const guide = guides[path];
  if (guide) return { ...guide, layout: 'sidebar' };

  if (path === '/components' || path === '/components/') {
    return {
      title: `Components — ${PRODUCT_NAME}`,
      description: 'Every component in the kit, grouped by concern.',
      element: <ComponentsIndex />,
      layout: 'sidebar',
    };
  }

  const params = matchRoute('/components/:slug', path);
  if (params?.slug) {
    const entry = findComponent(params.slug);
    return {
      title: entry
        ? `${entry.name} — ${PRODUCT_NAME}`
        : `Not found — ${PRODUCT_NAME}`,
      description: entry?.summary ?? 'Component not found.',
      element: <ComponentPage slug={params.slug} />,
      layout: 'sidebar',
    };
  }

  return {
    title: `Page not found — ${PRODUCT_NAME}`,
    description: 'That page does not exist.',
    element: <NotFound />,
    layout: 'sidebar',
  };
}

export function App() {
  const { path } = useRouter();
  const resolved = resolve(path);

  // Client-side navigation does not update these on its own, and a docs site
  // with one title for every page is no use in a tab strip or a share card.
  useEffect(() => {
    document.title = resolved.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', resolved.description);
  }, [resolved.title, resolved.description]);

  if (resolved.layout === 'plain') {
    return <PlainLayout>{resolved.element}</PlainLayout>;
  }

  return <SidebarLayout sidebar={<Sidebar />}>{resolved.element}</SidebarLayout>;
}
