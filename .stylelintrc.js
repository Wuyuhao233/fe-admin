module.exports = {
  extends: require.resolve('@umijs/max/stylelint'),
  rules: {
    'selector-id-pattern': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind'],
      },
    ],
  },
};
