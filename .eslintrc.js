module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser'
  },
  plugins: [
    'simple-import-sort',
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-undef': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'simple-import-sort/imports': 'error',
    'no-void': [
      'error',
      {
        allowAsStatement: true
      }
    ]
  },
  overrides: [
    {
      files: [
        './*.js',
        './src/**/*.js'
      ],
      parserOptions: {
        project: false
      },
      extends: [
        'standard'
      ],
      rules: {
        'no-void': 'off',
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
}
