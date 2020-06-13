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
    },
    {
      name: 'ember-3.15.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.15.0'
        }
      }
    },
    {
      name: 'ember-3.16.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.16.3'
        }
      }
    },
    {
      name: 'ember-3.17.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.17.0'
        }
      }
    },
    {
      name: 'ember-3.18.X',
      npm: {
        devDependencies: {
          'ember-source': '~3.18.1'
        }
      }
    }
  ]
};
