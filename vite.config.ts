import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    ignorePatterns: ['content/**'],
    singleQuote: true,
    printWidth: 120,
    sortTailwindcss: {},
    sortImports: {},
  },
});
