/*jshint node:true*/
module.exports = {
  scenarios: [
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
      name: 'ember-2.5.X',
      dependencies: {
        'ember': '~2.5.0'
      },
      resolutions: {
        'ember': '~2.5.0'
      }
    },
    {
      name: 'ember-2.6.X',
      dependencies: {
        'ember': '~2.6.0'
      },
      resolutions: {
        'ember': '~2.6.0'
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
