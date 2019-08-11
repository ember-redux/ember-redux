module.exports = {
  description: 'Installation blueprint for ember-redux',
  normalizeEntityName() {},

  afterInstall() {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-redux-thunk-shim', target: '^2.5.0'}
      ]
    });
  }
};
