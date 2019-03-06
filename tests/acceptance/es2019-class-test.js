import { test, module } from 'qunit';
import { visit, find, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | es2019 class e2e test', function(hooks) {
  setupApplicationTest(hooks);

  test('es2019 class based components will render', async function(assert) {
    await visit('/es19');
    assert.equal(currentURL(), '/es19');

    assert.equal(find('.init-low').textContent, '0');
    assert.equal(find('.init-hello').textContent, '0');
  });
});
