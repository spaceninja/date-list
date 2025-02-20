import globals from 'globals';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    ignores: ['dist/**/*'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2023,
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // this shouldn't be needed: https://github.com/vuejs/eslint-plugin-vue/issues/1635
      'vue/v-on-event-hyphenation': [
        'warn',
        'always',
        { ignore: ['update:modelValue'] },
      ],
    },
  },
  {
    // HACK: https://github.com/vuejs/eslint-plugin-vue/issues/1355
    files: ['**/*.html'],
    rules: { 'vue/comment-directive': 'off' },
  },
];
