/*global ajax:true*/

import Ember from 'ember';
import { test, module } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance | async dispatch test', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    Ember.run(application, 'destroy');
  }
});

test('route will fetch async data and dispatch to deserialize with the response', function(assert) {
  visit('/');
  andThen(() => {
    assert.equal(currentURL(), '/');
  });
  ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
  click('.users-link');
  andThen(() => {
    assert.equal(currentURL(), '/users');
    assert.equal(find('.user-name').length, 2);
    assert.equal(find('.user-setupcontroller-state').text().trim(), 'yes');
  });
  click('.counts-link');
  andThen(() => {
    assert.equal(currentURL(), '/');
  });
  ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
  click('.users-link');
  andThen(() => {
    assert.equal(currentURL(), '/users');
    assert.equal(find('.user-name').length, 2);
  });
});

test('master detail will show both list and selected user correctly', function(assert) {
  visit('/');
  andThen(() => {
    assert.equal(currentURL(), '/');
  });
  ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
  click('.users-link');
  andThen(() => {
    assert.equal(currentURL(), '/users');
    assert.equal(find('.user-name').length, 2);
  });
  ajax('/api/users/2', 'GET', 200, {id: 2, name: 'two'});
  click('.user-detail-link:eq(1)');
  andThen(() => {
    assert.equal(currentURL(), '/users/2');
    assert.equal(find('.user-name').length, 2);
    assert.equal(find('.user-detail-name').text().trim(), 'two');
  });
});

test('should fetch async data and display after xhr has resolved (super is called after actions are wired up)', function(assert) {
  visit('/');
  andThen(() => {
    assert.equal(currentURL(), '/');
  });
  ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
  click('.fetch-link');
  andThen(() => {
    assert.equal(currentURL(), '/fetch');
    assert.equal(find('.user-name').length, 2);
  });
  click('.counts-link');
  andThen(() => {
    assert.equal(currentURL(), '/');
  });
  ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 3, name: 'three'}]);
  click('.fetch-link');
  andThen(() => {
    assert.equal(currentURL(), '/fetch');
    assert.equal(find('.user-name').length, 3);
  });
});

test('route connect function should call super in the init', function(assert) {
  visit('/super');
  andThen(() => {
    assert.equal(currentURL(), '/super');
    var route = application.__container__.lookup('route:super');
    assert.equal(route.get('invoked'), true);
  });
});

test('deep linking directly will work as you would expect in ember', function(assert) {
  ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
  ajax('/api/users/2', 'GET', 200, {id: 2, name: 'two'});
  visit('/users/2');
  andThen(() => {
    assert.equal(currentURL(), '/users/2');
    assert.equal(find('.user-name').length, 2);
    assert.equal(find('.user-detail-name').text().trim(), 'two');
  });
});

test('parent and child templates render and re-render correctly when edits occur in the child component', function(assert) {
  ajax('/api/items', 'GET', 200, [{id: 1, name: 'first'}, {id: 2, name: 'second'}]);
  visit('/items');
  andThen(() => {
    assert.equal(currentURL(), '/items');
    assert.equal(find('.item-name').length, 2);
    assert.equal(find('.item-name:eq(0)').text().trim(), 'first');
    assert.equal(find('.item-name:eq(1)').text().trim(), 'second');
  });
  ajax('/api/items/2', 'GET', 200, {id: 2, name: 'updated'});
  click('.item-detail-link:eq(1)');
  andThen(() => {
    assert.equal(currentURL(), '/items/2');
    assert.equal(find('.item-detail-name').length, 1);
    assert.equal(find('.item-detail-name').val(), 'updated');
    assert.equal(find('.item-name').length, 2);
    assert.equal(find('.item-name:eq(0)').text().trim(), 'first');
    assert.equal(find('.item-name:eq(1)').text().trim(), 'updated');
  });
  ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
  click('.fetch-link');
  andThen(() => {
    assert.equal(currentURL(), '/fetch');
  });
  ajax('/api/items', 'GET', 200, [{id: 1, name: 'zap'}, {id: 2, name: 'updated'}, {id: 3, name: 'more'}]);
  click('.items-link');
  andThen(() => {
    assert.equal(currentURL(), '/items');
    assert.equal(find('.item-name').length, 3);
    assert.equal(find('.item-name:eq(0)').text().trim(), 'zap');
    assert.equal(find('.item-name:eq(1)').text().trim(), 'updated');
    assert.equal(find('.item-name:eq(2)').text().trim(), 'more');
  });
  ajax('/api/items/1', 'GET', 200, {id: 1, name: 'zap'});
  click('.item-detail-link:eq(0)');
  andThen(() => {
    assert.equal(currentURL(), '/items/1');
    assert.equal(find('.item-detail-name').length, 1);
    assert.equal(find('.item-detail-name').val(), 'zap');
    assert.equal(find('.item-name').length, 3);
    assert.equal(find('.item-name:eq(0)').text().trim(), 'zap');
    assert.equal(find('.item-name:eq(1)').text().trim(), 'updated');
    assert.equal(find('.item-name:eq(2)').text().trim(), 'more');
  });
  fillIn('.item-detail-name', 'x');
  andThen(() => {
    assert.equal(currentURL(), '/items/1');
    assert.equal(find('.item-detail-name').length, 1);
    assert.equal(find('.item-detail-name').val(), 'x');
    assert.equal(find('.item-name').length, 3);
    assert.equal(find('.item-name:eq(0)').text().trim(), 'x');
    assert.equal(find('.item-name:eq(1)').text().trim(), 'updated');
    assert.equal(find('.item-name:eq(2)').text().trim(), 'more');
  });
});

test('connected routes provide an ember route for you by default', function(assert) {
  ajax('/api/users', 'GET', 200, [{id: 1, name: 'one'}, {id: 2, name: 'two'}]);
  visit('/simple');
  andThen(() => {
    assert.equal(currentURL(), '/simple');
    assert.equal(find('.user-name').length, 2);
  });
});

test('connect supports action creator syntax', function(assert) {
  visit('/actionz');
  andThen(() => {
    assert.equal(currentURL(), '/actionz');
    assert.equal(find('.upp-low').text(), '0');
  });
  click('.btn-upp');
  andThen(() => {
    assert.equal(find('.upp-low').text(), '1');
  });
  click('.btn-upp');
  andThen(() => {
    assert.equal(find('.upp-low').text(), '2');
  });
  click('.btn-upp');
  andThen(() => {
    // remains 2 because of logic in the action
    assert.equal(find('.upp-low').text(), '2');
  });
});
