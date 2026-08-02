import type { Preview } from '@storybook/react';

import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: 'geocities',
      values: [
        { name: 'geocities', value: '#000080' },
        { name: 'notepad', value: '#ffffff' },
        { name: 'void', value: '#000000' },
      ],
    },
  },
};

export default preview;
