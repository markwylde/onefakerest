module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'semistandard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'object-property-newline': [
      'error',
      { allowAllPropertiesOnSameLine: false }
    ]
  }
};
