module.exports = {
  description: 'Installation blueprint for ember-redux',
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-redux-shim', target: '^2.1.0'},
        {name: 'ember-redux-thunk-shim', target: '^2.0.0'}
      ]
    });
  }
};
