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
