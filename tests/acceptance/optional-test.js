import Ember from 'ember';
import { test, module } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance | optional configuration test', {
  beforeEach() {
    window.invoked = false;
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('optional reducer invoked as part of the combined reducer pipeline', function(assert) {
  visit('/');
  click('.btn-up');
  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(window.invoked, true);
  });
});
