/* eslint-env node */
module.exports = {
  useYarn: true,
  scenarios: [
    {
      name: 'ember-2.16.X',
      npm: {
        devDependencies: {
          'ember-source': '~2.16.0'
        }
      }
    },
    {
      name: 'ember-2.18.X',
      npm: {
        devDependencies: {
          'ember-source': '~2.18.0'
        }
      }
    },
    {
      name: 'ember-beta',
      bower: {
        dependencies: {
          'ember': 'components/ember#beta'
        },
        resolutions: {
          'ember': 'beta'
        }
      },
      npm: {
        devDependencies: {
          'ember-source': null
        }
      }
    }
  ]
};
