import { test, module } from 'qunit';
import { visit, click, find, findAll, fillIn, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import ajax from '../helpers/ajax';

module('Acceptance | async dispatch test', function(hooks) {
  setupApplicationTest(hooks);

  test('route will fetch async data and dispatch to deserialize with the response', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    await ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
    await click('.users-link');
    assert.equal(currentURL(), '/users');
    assert.equal(findAll('.user-name').length, 2);
    assert.equal(find('.user-setupcontroller-state').textContent, 'yes');
    await click('.counts-link');
    assert.equal(currentURL(), '/');
    await ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
    await click('.users-link');
    assert.equal(currentURL(), '/users');
    assert.equal(findAll('.user-name').length, 2);
  });

  test('master detail will show both list and selected user correctly', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    await ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
    await click('.users-link');
    assert.equal(currentURL(), '/users');
    assert.equal(findAll('.user-name').length, 2);
    await ajax('/api/users/2', 'GET', 200, {id: 2, name: 'two'});
    await click('.user-detail-link:nth-of-type(2)');
    assert.equal(currentURL(), '/users/2');
    assert.equal(findAll('.user-name').length, 2);
    assert.equal(find('.user-detail-name').textContent, 'two');
  });

  test('should fetch async data and display after xhr has resolved (super is called after actions are wired up)', async function(assert) {
    await visit('/');
    assert.equal(currentURL(), '/');
    await ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
    await click('.fetch-link');
    assert.equal(currentURL(), '/fetch');
    assert.equal(findAll('.user-name').length, 2);
    await click('.counts-link');
    assert.equal(currentURL(), '/');
    await ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 3, name: 'three'}]);
    await click('.fetch-link');
    assert.equal(currentURL(), '/fetch');
    assert.equal(findAll('.user-name').length, 3);
  });

  test('route connect function should call super in the init', async function(assert) {
    await visit('/super');
    assert.equal(currentURL(), '/super');
    const route = this.owner.lookup('route:super');
    assert.equal(route.get('invoked'), true);
  });

  test('deep linking directly will work as you would expect in ember', async function(assert) {
    await ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
    await ajax('/api/users/2', 'GET', 200, {id: 2, name: 'two'});
    await visit('/users/2');
    assert.equal(currentURL(), '/users/2');
    assert.equal(findAll('.user-name').length, 2);
    assert.equal(find('.user-detail-name').textContent, 'two');
  });

  test('parent and child templates render and re-render correctly when edits occur in the child component', async function(assert) {
    await ajax('/api/items', 'GET', 200, [{id: 1, name: 'first'}, {id: 2, name: 'second'}]);
    await visit('/items');
    assert.equal(currentURL(), '/items');
    assert.equal(findAll('.item-name').length, 2);
    assert.equal(find('.item-name:nth-of-type(2)').textContent, 'first');
    assert.equal(find('.item-name:nth-of-type(3)').textContent, 'second');
    await ajax('/api/items/2', 'GET', 200, {id: 2, name: 'updated'});
    await click('.item-detail-link:nth-of-type(2)');
    assert.equal(currentURL(), '/items/2');
    assert.equal(findAll('.item-detail-name').length, 1);
    assert.equal(find('.item-detail-name').value, 'updated');
    assert.equal(findAll('.item-name').length, 2);
    assert.equal(find('.item-name:nth-of-type(2)').textContent, 'first');
    assert.equal(find('.item-name:nth-of-type(3)').textContent, 'updated');
    await ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
    await click('.fetch-link');
    assert.equal(currentURL(), '/fetch');
    await ajax('/api/items', 'GET', 200, [{id: 1, name: 'zap'}, {id: 2, name: 'updated'}, {id: 3, name: 'more'}]);
    await click('.items-link');
    assert.equal(currentURL(), '/items');
    assert.equal(findAll('.item-name').length, 3);
    assert.equal(find('.item-name:nth-of-type(2)').textContent, 'zap');
    assert.equal(find('.item-name:nth-of-type(3)').textContent, 'updated');
    assert.equal(find('.item-name:nth-of-type(4)').textContent, 'more');
    await ajax('/api/items/1', 'GET', 200, {id: 1, name: 'zap'});
    await click('.item-detail-link:nth-of-type(1)');
    assert.equal(currentURL(), '/items/1');
    assert.equal(findAll('.item-detail-name').length, 1);
    assert.equal(find('.item-detail-name').value, 'zap');
    assert.equal(findAll('.item-name').length, 3);
    assert.equal(find('.item-name:nth-of-type(2)').textContent, 'zap');
    assert.equal(find('.item-name:nth-of-type(3)').textContent, 'updated');
    assert.equal(find('.item-name:nth-of-type(4)').textContent, 'more');
    await fillIn('.item-detail-name', 'x');
    assert.equal(currentURL(), '/items/1');
    assert.equal(findAll('.item-detail-name').length, 1);
    assert.equal(find('.item-detail-name').value, 'x');
    assert.equal(findAll('.item-name').length, 3);
    assert.equal(find('.item-name:nth-of-type(2)').textContent, 'x');
    assert.equal(find('.item-name:nth-of-type(3)').textContent, 'updated');
    assert.equal(find('.item-name:nth-of-type(4)').textContent, 'more');
  });

  test('connected routes provide an ember route for you by default', async function(assert) {
    await ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
    await visit('/simple');
    assert.equal(currentURL(), '/simple');
    assert.equal(findAll('.user-name').length, 2);
  });

  test('connect supports action creator syntax', async function(assert) {
    await visit('/actionz');
    assert.equal(currentURL(), '/actionz');
    assert.equal(find('.upp-low').textContent, '0');
    await click('.btn-upp');
    assert.equal(find('.upp-low').textContent, '1');
    await click('.btn-upp');
    assert.equal(find('.upp-low').textContent, '2');
    await click('.btn-upp');
    // remains 2 because of logic in the action
    assert.equal(find('.upp-low').textContent, '2');
  });
});
