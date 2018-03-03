import { test, module } from 'qunit';
import { visit, click, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { patchMiddleware } from '../helpers/patch-middleware';

module('Acceptance | middleware configuration test', function(hooks) {
  setupApplicationTest(hooks);
  patchMiddleware(hooks);

  test('can override middleware with a special setup function', async function(assert) {
    await visit('/saga');
    await click('.btn-saga');
    await click('.btn-saga');
    await click('.btn-saga');
    assert.equal(currentURL(), '/saga');
    assert.equal(find('.saga-number').textContent, '3');
    assert.equal(window.middlewareArgs.length, 1);
    assert.deepEqual(Object.keys(window.middlewareArgs[0]), ['dispatch', 'subscribe', 'getState', 'replaceReducer']);
  });
});
