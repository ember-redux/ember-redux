/* eslint-env node */
module.exports = {
  useYarn: true,

  command: "ember test -e=production",

  scenarios: [
    {
      name: 'ember-3.4.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.4.0'
        }
      }
    },
    {
      name: 'ember-3.5.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.5.0'
        }
      }
    },
    {
      name: 'ember-3.6.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.6.0'
        }
      }
    },
    {
      name: 'ember-3.7.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.7.0'
        }
      }
    }
  ]
};
