import { run } from '@ember/runloop';
import { test, module } from 'qunit';
import startApp from '../helpers/start-app';

var application, redux;

module('Acceptance | bootstrap test', {
  beforeEach() {
    application = startApp();
    redux = application.__container__.lookup('service:redux');
  },
  afterEach() {
    run(application, 'destroy');
  }
});

test('on boot the static role configuration is loaded', function(assert) {
  visit('/');
  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(redux.getState().roles.all.length, 2);
    assert.equal(redux.getState().roles.all[0].id, 2);
    assert.equal(redux.getState().roles.all[0].name, 'Admin');
    assert.equal(redux.getState().roles.all[1].id, 3);
    assert.equal(redux.getState().roles.all[1].name, 'Guest');
  });
});

