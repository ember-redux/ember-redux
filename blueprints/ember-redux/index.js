/*jshint node:true*/
module.exports = {
  description: 'Installation blueprint for ember-redux',
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-browserify', target: '^1.1.11'},
      ]
    }).then(function() {
      return this.addPackagesToProject([
        {name: 'redux', target: '^3.5.2'},
        {name: 'redux-thunk', target: '^2.1.0'}
      ]);
    }.bind(this));
  },

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
