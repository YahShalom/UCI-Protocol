
// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const reactRecommended = require('eslint-plugin-react/configs/recommended.js');
const globals = require("globals");

module.exports = tseslint.config(
  {
    ignores: [".next/**", "eslint.config.js"],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off', 
    }
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);
