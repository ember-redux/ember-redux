module.exports = {
  description: 'Installation blueprint for ember-redux',
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-redux-shim', target: '^2.4.0'},
        {name: 'ember-redux-thunk-shim', target: '^2.3.0'}
      ]
    });
  }
};
