// .eslintrc.js
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended"
  ],
  plugins: [
    "@typescript-eslint",
    "react",
    "jsx-a11y"
  ],
  settings: {
    "react": {
      "version": "detect"
    },
    "import/core-modules": [
      "esm",
      "jsx",
      "react",
      "react-dom"
    ],
    "import/parsers": {
      "@typescript-eslint/parser": {
        "eslintPath": [
          "node_modules/@typescript-eslint/eslint-plugin",
          "node_modules/@typescript-eslint/parser"
        ]
      }
    }
  },
  rules: {
    // Your ESLint rules here
  }
};