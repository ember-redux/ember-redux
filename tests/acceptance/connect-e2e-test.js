import { test, module } from 'qunit';
import { visit, click, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

var redux, subscribed, unsubscribed, original;

module('Acceptance | subscribe e2e test', function(hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function() {
    subscribed = 0;
    unsubscribed = 0;
    redux = this.owner.lookup('service:redux');
    original = redux.subscribe;
    redux.subscribe = function() {
      subscribed = subscribed + 1;
      var unsubscribe = original.apply(this, arguments);
      var unsubscribe_copy = unsubscribe;
      unsubscribe = function() {
        unsubscribed = unsubscribed + 1;
        return unsubscribe_copy.apply(this, arguments);
      };
      return unsubscribe;
    };
  });

  hooks.afterEach(function() {
    redux.subscribe = original;
  });

  test('should subscribe and unsubscribe when components are created/destroyed', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    assert.equal(subscribed, 1);
    assert.equal(unsubscribed, 0);
    await click('.dashboard-link');
    assert.equal(currentURL(), '/dashboard');
    assert.equal(subscribed, 2);
    assert.equal(unsubscribed, 1);
    await click('.counts-link');
    assert.equal(currentURL(), '/');
    assert.equal(subscribed, 3);
    assert.equal(unsubscribed, 2);
  });

  test('es2015 class based components subscribe and unsubscribe when components are created/destroyed', async function(assert) {
    await visit('/clazz');
    assert.equal(currentURL(), '/clazz');
    assert.equal(subscribed, 1);
    assert.equal(unsubscribed, 0);
    await click('.dashboard-link');
    assert.equal(currentURL(), '/dashboard');
    assert.equal(subscribed, 2);
    assert.equal(unsubscribed, 1);
    await click('.clazz-link');
    assert.equal(currentURL(), '/clazz');
    assert.equal(subscribed, 3);
    assert.equal(unsubscribed, 2);
  });

  test('components without state should not subscribe or unsubscribe', async function(assert) {
    await visit('/empty');
    assert.equal(currentURL(), '/empty');
    assert.equal(subscribed, 0);
    assert.equal(unsubscribed, 0);
    assert.equal(find('.empty-state').textContent, 'empty');
    await click('.dashboard-link');
    assert.equal(currentURL(), '/dashboard');
    assert.equal(subscribed, 1);
    assert.equal(unsubscribed, 0);
    await click('.counts-link');
    assert.equal(currentURL(), '/');
    assert.equal(subscribed, 2);
    assert.equal(unsubscribed, 1);
  });

  test('init for EmberObject based components will render', async function(assert) {
    await visit('/init');
    assert.equal(currentURL(), '/init');
    assert.equal(find('.init-low').textContent, '0');
    assert.equal(find('.init-hello').textContent, '0');
  });
});
