import { test, module } from 'qunit';
import { visit, click, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | es2015 class e2e test', function(hooks) {
  setupApplicationTest(hooks);

  test('es2015 class based components dispatch & render state from redux', async function(assert) {
    await visit('/clazz');
    assert.equal(currentURL(), '/clazz');
    assert.equal(find('.clazz-state').textContent, '0');
    assert.equal(find('.clazz-up').textContent, 'up');
    assert.equal(find('.clazz-color').textContent, 'orange');
    await click('.clazz-up');
    assert.equal(currentURL(), '/clazz');
    assert.equal(find('.clazz-state').textContent, '1');
    assert.equal(find('.clazz-color').textContent, 'orange');
  });

  test('es2015 class based components support action creator syntax', async function(assert) {
    await visit('/clazz-actionz');
    assert.equal(currentURL(), '/clazz-actionz');
    assert.equal(find('.upp-low').textContent, '0');
    assert.equal(find('.clazz-color').textContent, 'green');
    await click('.btn-upp');
    assert.equal(find('.upp-low').textContent, '1');
    assert.equal(find('.clazz-color').textContent, 'green');
    await click('.btn-upp');
    assert.equal(find('.upp-low').textContent, '2');
    assert.equal(find('.clazz-color').textContent, 'green');
    await click('.btn-upp');
    // remains 2 because of logic in the action
    assert.equal(find('.upp-low').textContent, '2');
    assert.equal(find('.clazz-color').textContent, 'green');
  });

  test('es2015 class based components support stateToComputed factory functions', async function(assert) {
    await visit('/clazz-factorie');
    assert.equal(currentURL(), '/clazz-factorie');
    assert.equal(find('.uppp-low').textContent, '0');
    assert.equal(find('.clazz-color').textContent, 'white');
    await click('.btn-uppp');
    assert.equal(find('.clazz-color').textContent, 'white');
    assert.equal(find('.uppp-low').textContent, '1');
  });

  test('es2015 class based components will render', async function(assert) {
    await visit('/clazz');
    assert.equal(currentURL(), '/clazz');

    assert.equal(find('.init-low').textContent, '0');
    assert.equal(find('.init-hello').textContent, '0');
  });
});
