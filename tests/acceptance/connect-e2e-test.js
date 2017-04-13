import Ember from 'ember';
import { test, module } from 'qunit';
import startApp from '../helpers/start-app';

var application, redux, subscribed, unsubscribed, original;

module('Acceptance | subscribe e2e test', {
  beforeEach() {
    subscribed = 0;
    unsubscribed = 0;
    application = startApp();
    redux = application.__container__.lookup('service:redux');
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
  },
  afterEach() {
    redux.subscribe = original;
    Ember.run(application, 'destroy');
  }
});

test('should subscribe and unsubscribe when components are created/destroyed', function(assert) {
  visit('/');
  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(subscribed, 1);
    assert.equal(unsubscribed, 0);
  });
  click('.dashboard-link');
  andThen(() => {
    assert.equal(currentURL(), '/dashboard');
    assert.equal(subscribed, 2);
    assert.equal(unsubscribed, 1);
  });
  click('.counts-link');
  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(subscribed, 3);
    assert.equal(unsubscribed, 2);
  });
});

test('components without state should not subscribe or unsubscribe', function(assert) {
  visit('/empty');
  andThen(() => {
    assert.equal(currentURL(), '/empty');
    assert.equal(subscribed, 0);
    assert.equal(unsubscribed, 0);
    assert.equal(find('.empty-state').text(), 'empty');
  });
  click('.dashboard-link');
  andThen(() => {
    assert.equal(currentURL(), '/dashboard');
    assert.equal(subscribed, 1);
    assert.equal(unsubscribed, 0);
  });
  click('.counts-link');
  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(subscribed, 2);
    assert.equal(unsubscribed, 1);
  });
});


test('binding computed props does not affect redux state', function(assert) {
  visit('/project');
  assert.deepEqual(redux.getState().project, { name: 'Chores' });

  fillIn('.project-name', 'Todos');

  andThen(() => {
    assert.deepEqual(redux.getState().project, { name: 'Chores' }, 'state should not be affected by Ember binding');
  });
});
