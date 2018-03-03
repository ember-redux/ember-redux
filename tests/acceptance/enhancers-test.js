import { test, module } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | enhancers configuration test', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    window.executed = false;
  });

  hooks.afterEach(function() {
    window.executed = undefined;
  });

  test('enhancer executed as part of the compose redux pipeline', async function(assert) {
    await visit('/');
    await click('.btn-up');
    assert.equal(currentURL(), '/');
    assert.equal(window.executed, true);
  });
});
