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
