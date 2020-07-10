module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    project: './tsconfig.json'
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
        '**/*.vue'
      ],
      extends: [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript/recommended'
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off'
      }
    },
    {
      files: [
        '**/*.ts'
      ],
      extends: [
        'standard-with-typescript'
      ],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off'
      }
    },
    {
      files: [
        '**/*.js'
      ],
      extends: [
        'standard'
      ]
    }
  ]
}
