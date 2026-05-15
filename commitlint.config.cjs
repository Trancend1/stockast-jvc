module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'perf', 'docs', 'style', 'test', 'chore', 'revert', 'build', 'ci'],
    ],
    'scope-enum': [
      1,
      'always',
      ['auth', 'stock', 'recommendation', 'promo', 'ai', 'ui', 'db', 'infra', 'docs'],
    ],
    'subject-case': [0],
  },
};
