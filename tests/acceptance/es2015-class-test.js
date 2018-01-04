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
  });
  click('.clazz-up');
  andThen(() => {
    assert.equal(currentURL(), '/clazz');
    assert.equal(find('.clazz-state').text(), '1');
    assert.equal(find('.clazz-color').text(), 'orange');
  });
});
