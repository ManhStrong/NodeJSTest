module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  },
  extends: [
    //   "plugin:you-dont-need-lodash-underscore/compatible",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    //   "plugin:jest/recommended",
    //   "plugin:jest/style",
    "plugin:security/recommended",
    "plugin:prettier/recommended",
    "prettier"
  ],
  plugins: [
    "@typescript-eslint",
    "prettier",
    //   "jest",
    "security",
    "node"
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "semi": true,
        "printWidth": 120,
        "tabWidth": 4
      }
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true
      }
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/semi": "warn",
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-namespace": "warn",
    "@typescript-eslint/require-await": "warn",
    "security/detect-object-injection": "warn",
    "no-var": "error",
    "no-console": "warn",
    "camelcase": "off",
    "curly": "warn",
    "eqeqeq": ["error", "smart"],
    "no-throw-literal": "warn",
    "semi": "off",
    "no-empty": "warn",
    "no-unused-expressions": ["error", { "allowTernary": true }],
    "no-use-before-define": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variableLike",
        "format": ["camelCase", "UPPER_CASE"],
        "leadingUnderscore": "allow"
      },
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "variable",
        "types": ["boolean"],
        "format": ["PascalCase", "UPPER_CASE"],
        "prefix": ["is", "should", "has", "can", "did", "will"]
      },
      {
        "selector": "variable",
        "format": ["UPPER_CASE", "PascalCase", "camelCase"],
        "modifiers": ["global"]
      }
      // {
      //   "selector": "typeParameter",
      //   "format": ["PascalCase"],
      //   "prefix": ["T"]
      // }
    ]
  },
  ignorePatterns: [
    "*.js",
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    "dist",
    ".sst",
    "/**/node_modules/*"
  ]
}