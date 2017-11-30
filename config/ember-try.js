/* eslint-env node */
module.exports = {
  useYarn: true,
  scenarios: [
    {
      name: 'ember-2.12.X',
      npm: {
        devDependencies: {
          'ember-source': '~2.12.0'
        }
      }
    },
    {
      name: 'ember-2.17.X',
      npm: {
        devDependencies: {
          'ember-source': '~2.17.0'
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
