import { test, module } from 'qunit';
import { visit, click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import ajax from '../helpers/ajax';

module('Acceptance | thunk dispatch test', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    window.loadingInvoked = false;
  });

  hooks.afterEach(function() {
    window.loadingInvoked = undefined;
  });

  test('route loads data with Ember loading state', async function(assert) {
    assert.expect(3);
    const usersData = [{id: 1, name: 'one'}, {id: 2, name: 'two'}];
    await ajax('/api/users', 'GET', 200, usersData, 500);
    await visit('/');
    assert.equal(currentURL(), '/');
    await click('.thunk-link');
    assert.equal(currentURL(), '/thunk');
    // assert.equal(findAll('.user-name').length, 2);
    assert.equal(window.loadingInvoked, true, 'Ember model loading hook is invoked.');
  });
});
