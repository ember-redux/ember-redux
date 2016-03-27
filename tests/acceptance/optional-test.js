import Ember from 'ember';
import { test, module } from 'qunit';
import startApp from '../helpers/start-app';

var application, original, invoked = false;

module('Acceptance | optional configuration test', {
    beforeEach() {
        application = startApp();
        original = window.require('dummy/reducers/optional')['default'];
        window.require('dummy/reducers/optional')['default'] = function(combine) {
            return (state, action) => {
                invoked = true;
                return combine(state, action);
            };
        };
    },
    afterEach() {
        Ember.run(application, 'destroy');
    }
});

test('optional reducer invoked as part of the combined reducer pipeline', function(assert) {
    visit('/');
    click('.btn-up');
    andThen(() => {
        assert.equal(currentURL(), '/');
        assert.equal(invoked, true);
    });
});
