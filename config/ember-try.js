/* eslint-env node */
module.exports = {
  useYarn: true,

  command: "ember test -e=production",

  scenarios: [
    {
      name: 'ember-3.6.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.6.0'
        }
      }
    },
    {
      name: 'ember-3.8.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.8.0'
        }
      }
    },
    {
      name: 'ember-3.12.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.12.0'
        }
      }
    }
  ]
};
