import Ember from 'ember';
import { test, module } from 'qunit';
import patchMiddleware from '../helpers/patch-middleware';
import startApp from '../helpers/start-app';

var application;

module('Acceptance | middleware configuration test', {
    beforeEach() {
        patchMiddleware();
        application = startApp();
    },
    afterEach() {
        Ember.run(application, 'destroy');
    }
});

test('can override middleware with a special setup function', function(assert) {
    visit('/saga');
    click('.btn-saga');
    click('.btn-saga');
    click('.btn-saga');
    andThen(() => {
        assert.equal(currentURL(), '/saga');
        assert.equal(find('.saga-number').text().trim(), '3');
    });
});
