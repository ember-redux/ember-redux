/*jshint node:true*/
module.exports = {
  description: 'Installation blueprint for ember-redux',
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addPackagesToProject([
      {name: 'redux', target: '^3.5.2'},
      {name: 'redux-thunk', target: '^2.1.0'}
    ]);
  }
};
