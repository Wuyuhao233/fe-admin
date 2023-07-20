module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
