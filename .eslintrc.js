const path = require('path');

module.exports = {
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  rules: {
    'import/no-unresolved': 0,
    // 'no-unused-vars': 0,
    // '@typescript-eslint/no-unused-vars': 2,
    // 'no-useless-constructor': 0,
    // '@typescript-eslint/no-useless-constructor': 2,
    "no-underscore-dangle": 0,
    'class-methods-use-this': 0,
    'no-undef': 0,
    'global-require': 0,

    'no-shadow': 1,

    // This one is debatable
    'no-restricted-syntax': 0,

    "import/extensions": [
      "error",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],

    // Because it doesn't parse correct package.json
    'import/no-extraneous-dependencies': 0,

    // Because in this project the api return snake_case
    '@typescript-eslint/camelcase': 0,

    // Because we need that to mutate the state
    'no-param-reassign': 0,

    'no-continue': 0,
    'no-await-in-loop': 1,

    // This rules are dump
    'no-bitwise': 0,
    'no-plusplus': 0,

    // Fix rules conflict
    "semi": "off",
    "@typescript-eslint/semi": ["error"],

    // @todo those should be enabled, disabled for debugging
    'no-console': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-dupe-class-members': 0,

    'max-len': ['warn', 130]
  }
}
