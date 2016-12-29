module.exports = {
  scenarios: [
    {
      name: 'ember-2.0.X',
      dependencies: {
        'ember': '~2.0.0'
      },
      resolutions: {
        'ember': '~2.0.0'
      }
    },
    {
      name: 'ember-2.4.X',
      dependencies: {
        'ember': '~2.4.0'
      },
      resolutions: {
        'ember': '~2.4.0'
      }
    },
    {
      name: 'ember-2.8.X',
      dependencies: {
        'ember': '~2.8.0'
      },
      resolutions: {
        'ember': '~2.8.0'
      }
    },
    {
      name: 'ember-2.10.X',
      dependencies: {
        'ember': '~2.10.0'
      },
      resolutions: {
        'ember': '~2.10.0'
      }
    },
    {
      name: 'ember-beta',
      dependencies: {
        'ember': 'components/ember#beta'
      },
      resolutions: {
        'ember': 'beta'
      }
    }
  ]
};
