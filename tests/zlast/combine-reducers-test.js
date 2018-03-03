import { test, module } from 'qunit';
import { visit, click, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { patchReducer } from '../helpers/patch-reducer';

module('Acceptance | combine reducers test', function(hooks) {
  setupApplicationTest(hooks);
  patchReducer(hooks);

  test('reducer can use combineReducers function directly', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    assert.equal(find('.parent-state').textContent, '0');
    assert.equal(find('.combined').textContent, 'false');
    await click('.btn-combine');
    assert.equal(currentURL(), '/');
    assert.equal(find('.parent-state').textContent, '0');
    assert.equal(find('.combined').textContent, 'true');
    await click('.btn-up');
    assert.equal(currentURL(), '/');
    assert.equal(find('.parent-state').textContent, '1');
    assert.equal(find('.combined').textContent, 'true');
  });
});
