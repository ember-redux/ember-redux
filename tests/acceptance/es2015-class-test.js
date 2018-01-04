import { run } from '@ember/runloop';
import { test, module } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance | es2015 class e2e test', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    run(application, 'destroy');
  }
});

test('es2015 class based components dispatch & render state from redux', function(assert) {
  visit('/clazz');
  andThen(() => {
    assert.equal(currentURL(), '/clazz');
    assert.equal(find('.clazz-state').text(), '0');
    assert.equal(find('.clazz-up').text(), 'up');
    assert.equal(find('.clazz-color').text(), 'orange');
  });
  click('.clazz-up');
  andThen(() => {
    assert.equal(currentURL(), '/clazz');
    assert.equal(find('.clazz-state').text(), '1');
    assert.equal(find('.clazz-color').text(), 'orange');
  });
});

test('es2015 class based components support action creator syntax', function(assert) {
  visit('/clazz-actionz');
  andThen(() => {
    assert.equal(currentURL(), '/clazz-actionz');
    assert.equal(find('.upp-low').text(), '0');
    assert.equal(find('.clazz-color').text(), 'green');
  });
  click('.btn-upp');
  andThen(() => {
    assert.equal(find('.upp-low').text(), '1');
    assert.equal(find('.clazz-color').text(), 'green');
  });
  click('.btn-upp');
  andThen(() => {
    assert.equal(find('.upp-low').text(), '2');
    assert.equal(find('.clazz-color').text(), 'green');
  });
  click('.btn-upp');
  andThen(() => {
    // remains 2 because of logic in the action
    assert.equal(find('.upp-low').text(), '2');
    assert.equal(find('.clazz-color').text(), 'green');
  });
});

test('es2015 class based components support stateToComputed factory functions', function(assert) {
  visit('/clazz-factorie');
  andThen(() => {
    assert.equal(currentURL(), '/clazz-factorie');
    assert.equal(find('.uppp-low').text(), '0');
    assert.equal(find('.clazz-color').text(), 'white');
  });
  click('.btn-uppp');
  andThen(() => {
    assert.equal(find('.clazz-color').text(), 'white');
    assert.equal(find('.uppp-low').text(), '1');
  });
});
