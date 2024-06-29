module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', Infinity],
    'subject-max-length': [2, 'always', Infinity],
  },
};
