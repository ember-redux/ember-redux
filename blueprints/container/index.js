/*jshint node:true*/
'use strict';


var path = require('path');

module.exports = {
  description: 'Generates a reducer for Redux.',

  fileMapTokens: function() {
    var self = this;
    return {
      __root__: function(options) {
        if (!!self.project.config()['ember-redux'] && !!self.project.config()['ember-redux'].directory) {
          return self.project.config()['ember-redux'].directory;
        } else if (options.inAddon) {
          return path.join('tests', 'dummy', 'app');
        } else {
          return '/app';
        }
      }
    };
  }

};
