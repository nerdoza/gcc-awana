module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
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
      parserOptions: {
        extraFileExtensions: ['.vue']
      },
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
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
        '*.js',
        './src/**/*.js'
      ],
      extends: [
        'standard'
      ]
    }
  ]
}
