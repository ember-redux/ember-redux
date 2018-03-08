import { test, module } from 'qunit';
import { visit, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import ajax from '../helpers/ajax';

module('Acceptance | route hooks', function(hooks) {
  setupApplicationTest(hooks);

  test('route hooks such as afterModel should have all its params be accessible in a connect', async function(assert) {
    ajax('/api/items', 'GET', 200, [{id: 1, name: 'first'}, {id: 2, name: 'second'}]);
    await visit('/items');
    assert.equal(currentURL(), '/items');
    assert.equal(find('#after-model-transition').textContent, 'ok');
  });

  test('route properties such as queryParams should be accessible in a connect', async function(assert) {
    await visit('/query-params');
    assert.equal(currentURL(), '/query-params');
    assert.equal(find('.query-param-name').textContent, 'foo');
  });
});
