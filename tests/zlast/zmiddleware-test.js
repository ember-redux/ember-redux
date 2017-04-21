import Ember from 'ember';
import { test, module } from 'qunit';
import { applyPatch, revertPatch } from '../helpers/patch-middleware';
import startApp from '../helpers/start-app';

var application;

module('Acceptance | middleware configuration test', {
  beforeEach() {
    applyPatch();
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
    revertPatch();
  }
});

test('can override middleware with a special setup function', function(assert) {
  visit('/saga');
  click('.btn-saga');
  click('.btn-saga');
  click('.btn-saga');
  andThen(() => {
    assert.equal(currentURL(), '/saga');
    assert.equal(find('.saga-number').text().trim(), '3');
    assert.equal(window.middlewareArgs.length, 1);
    assert.deepEqual(Object.keys(window.middlewareArgs[0]), ['dispatch', 'subscribe', 'getState', 'replaceReducer']);
  });
});
