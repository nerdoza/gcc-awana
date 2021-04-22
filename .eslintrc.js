module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
    sourceType: 'module',
    createDefaultProgram: false
  },
  plugins: [
    'simple-import-sort',
    '@typescript-eslint'
  ],
  rules: {
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
        './src/**/*.vue'
      ],
      extends: [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript/recommended'
      ],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
        createDefaultProgram: false
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-undef': 'off'
      }
    },
    {
      files: [
        './src/**/*.ts'
      ],
      extends: [
        'standard-with-typescript'
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
      }
    },
    {
      files: [
        './*.js',
        './src/**/*.js'
      ],
      extends: [
        'standard'
      ]
    }
  ]
}
