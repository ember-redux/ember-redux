import Ember from 'ember';
import { test, module } from 'qunit';
import { applyPatch, revertPatch } from '../helpers/patch-reducer';
import startApp from '../helpers/start-app';

var application;

module('Acceptance | combine reducers test', {
  beforeEach() {
    applyPatch();
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
    revertPatch();
  }
});

test('reducer can use combineReducers function directly', function(assert) {
  visit('/');
  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(find('.parent-state').text(), '0');
    assert.equal(find('.combined').text().trim(), 'false');
  });
  click('.btn-combine');
  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(find('.parent-state').text(), '0');
    assert.equal(find('.combined').text().trim(), 'true');
  });
  click('.btn-up');
  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(find('.parent-state').text(), '1');
    assert.equal(find('.combined').text().trim(), 'true');
  });
});
