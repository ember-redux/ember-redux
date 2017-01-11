module.exports = {
  description: 'Installation blueprint for ember-redux',
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-redux-shim', target: '0.0.5'},
        {name: 'ember-redux-thunk-shim', target: '0.0.6'}
      ]
    });
  }
};
