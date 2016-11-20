import Ember from 'ember';
import { test, module } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance | enhancers configuration test', {
  beforeEach() {
    window.executed = false;
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('enhancer executed as part of the compose redux pipeline', function(assert) {
  visit('/');
  click('.btn-up');
  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(window.executed, true);
  });
});
