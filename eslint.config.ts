import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt()
  .overrideRules({
    'vue/max-attributes-per-line': 'off',
  });
