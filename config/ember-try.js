/* eslint-env node */
module.exports = {
  useYarn: true,

  command: "ember test -e=production",

  scenarios: [
    {
      name: 'ember-3.15.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.15.0'
        }
      }
    }
  ]
};
