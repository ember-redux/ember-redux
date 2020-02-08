import { test, module } from 'qunit';
import { visit, click, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { gte } from 'ember-compatibility-helpers';

module('Acceptance | octane class e2e test', function(hooks) {
  setupApplicationTest(hooks);

  test('octane class based components support action creator syntax', async function(assert) {
    if(gte('3.15.0')) {
      assert.expect(9);

      await visit('/octane-actionz');
      assert.equal(currentURL(), '/octane-actionz');
      assert.equal(find('.upp-low').textContent, '0');
      assert.equal(find('.clazz-color').textContent, 'orange');
      await click('.btn-upp');
      assert.equal(find('.upp-low').textContent, '1');
      assert.equal(find('.clazz-color').textContent, 'orange');
      await click('.btn-upp');
      assert.equal(find('.upp-low').textContent, '2');
      assert.equal(find('.clazz-color').textContent, 'orange');
      await click('.btn-upp');
      // remains 2 because of logic in the action
      assert.equal(find('.upp-low').textContent, '2');
      assert.equal(find('.clazz-color').textContent, 'orange');
    } else {
      assert.ok(true, 'Tests are not executed and marked as passed');
    }
  });

  test('octane class based components support stateToComputed factory functions', async function(assert) {
    if(gte('3.15.0')) {
      assert.expect(5);

      await visit('/octane-factorie');
      assert.equal(currentURL(), '/octane-factorie');
      assert.equal(find('.uppp-low').textContent, '0');
      assert.equal(find('.clazz-color').textContent, 'yellow');
      await click('.btn-uppp');
      assert.equal(find('.clazz-color').textContent, 'yellow');
      assert.equal(find('.uppp-low').textContent, '1');
    } else {
      assert.ok(true, 'Tests are not executed and marked as passed');
    }
  });

});
