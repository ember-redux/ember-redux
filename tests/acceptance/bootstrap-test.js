import { test, module } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

var redux;

module('Acceptance | bootstrap test', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    redux = this.owner.lookup('service:redux');
  });

  test('on boot the static role configuration is loaded', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    assert.equal(redux.getState().roles.all.length, 2);
    assert.equal(redux.getState().roles.all[0].id, 2);
    assert.equal(redux.getState().roles.all[0].name, 'Admin');
    assert.equal(redux.getState().roles.all[1].id, 3);
    assert.equal(redux.getState().roles.all[1].name, 'Guest');
  });
});
