module.exports = {
  description: 'Installation blueprint for ember-redux',
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-redux-shim', target: '^1.1.0'},
        {name: 'ember-redux-thunk-shim', target: '^1.0.0'}
      ]
    });
  }
};
