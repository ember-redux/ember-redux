module.exports = {
  description: 'Installation blueprint for ember-redux',
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-redux-shim', target: '^4.0.1'},
        {name: 'ember-redux-thunk-shim', target: '^2.5.0'}
      ]
    });
  }
};
