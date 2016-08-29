/*jshint node:true*/

var stringUtils = require('ember-cli-string-utils');
var testInfo    = require('ember-cli-test-info');

module.exports = {
  description: 'Generates a reducer test',

  locals: function(options) {
    return {
      friendlyTestName: testInfo.name(options.entity.name, 'Unit', 'Reducer'),
      dasherizedModulePrefix: stringUtils.dasherize(options.project.config().modulePrefix)
    };
  }
};
