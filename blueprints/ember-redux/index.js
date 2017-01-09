module.exports = {
  description: 'Installation blueprint for ember-redux',
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-redux-shim', target: '0.0.1'},
        {name: 'ember-redux-thunk', target: '0.0.1'}
      ]
    });
  }
};
