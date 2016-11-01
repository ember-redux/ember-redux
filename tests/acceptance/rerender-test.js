import Ember from 'ember';
import { test, module } from 'qunit';
import startApp from '../helpers/start-app';

var application, oneUpdated = 0, twoUpdated = 0, fourUpdated = 0, fiveUpdated = 0;

function findComponentsByName(name) {
    const componentMap = application.__container__.lookup('-view-registry:main');
    const components = Object.keys(componentMap).map(key => componentMap[key]);
    return components.filter(component =>
        component.constructor.toString().includes(`component:${name}`)
    );
}

module('Acceptance | rerender test', {
    beforeEach() {
        application = startApp();
    },
    afterEach() {
        Ember.run(application, 'destroy');
    }
});

test('should only rerender when connected component is listening for each state used to compute', function(assert) {
    ajax('/api/lists', 'GET', 200, [{id: 1, name: 'one', reviews: [{rating: 5}, {rating: 5}]}, {id: 2, name: 'two', reviews: [{rating: 3}, {rating: 1}]}]);
    visit('/lists');
    andThen(() => {
        assert.equal(currentURL(), '/lists');
        assert.equal(find('.list-item-one .item-name').length, 2);
        assert.equal(find('.list-item-one .item-rating').length, 4);
        assert.equal(find('.list-item-two .item-name').length, 2);
        assert.equal(find('.list-item-two .item-rating').length, 4);
        assert.equal(find('.list-item-three .item-name').length, 2);
        assert.equal(find('.list-item-three .item-rating').length, 4);
        assert.equal(find('.unrelated-one').text(), '');
        assert.equal(find('.random-one').text(), '');
    });
    andThen(() => {
        var componentOne = findComponentsByName('list-one');
        var componentTwo = findComponentsByName('list-two');
        var componentFour = findComponentsByName('unrelated-one');
        var componentFive = findComponentsByName('random-one');

        componentOne.forEach(c => c.on('didRender', () => oneUpdated++));
        componentTwo.forEach(c => c.on('didRender', () => twoUpdated++));
        componentFour.forEach(c => c.on('didRender', () => fourUpdated++));
        componentFive.forEach(c => c.on('didRender', () => fiveUpdated++));
    });
    click('.filter-list:eq(0)');
    andThen(() => {
        assert.equal(currentURL(), '/lists');
        assert.equal(find('.list-item-one .item-name').length, 1);
        assert.equal(find('.list-item-one .item-rating').length, 2);
        assert.equal(find('.list-item-two .item-name').length, 1);
        assert.equal(find('.list-item-two .item-rating').length, 2);
        assert.equal(find('.list-item-three .item-name').length, 1);
        assert.equal(find('.list-item-three .item-rating').length, 2);
        assert.equal(find('.unrelated-one').text(), '');
        assert.equal(find('.random-one').text(), '');
    });
    ajax('/api/lists', 'GET', 200, [{id: 1, name: 'one', reviews: [{rating: 5}, {rating: 5}, {rating: 1}]}, {id: 2, name: 'two', reviews: [{rating: 3}, {rating: 1}]}]);
    click('.refresh-list:eq(0)');
    andThen(() => {
        assert.equal(currentURL(), '/lists');
        assert.equal(find('.list-item-one .item-name').length, 0);
        assert.equal(find('.list-item-two .item-name').length, 0);
        assert.equal(find('.list-item-three .item-name').length, 0);
        assert.equal(find('.unrelated-one').text(), '');
        assert.equal(find('.random-one').text(), '');
    });
    click('.filter-list:eq(1)');
    andThen(() => {
        assert.equal(currentURL(), '/lists');
        assert.equal(find('.list-item-one .item-name').length, 2);
        assert.equal(find('.list-item-one .item-rating').length, 5);
        assert.equal(find('.list-item-one .item-rating:eq(2)').text(), '1');
        assert.equal(find('.list-item-two .item-name').length, 2);
        assert.equal(find('.list-item-two .item-rating').length, 5);
        assert.equal(find('.list-item-two .item-rating:eq(2)').text(), '1');
        assert.equal(find('.list-item-three .item-name').length, 2);
        assert.equal(find('.list-item-three .item-rating').length, 5);
        assert.equal(find('.unrelated-one').text(), '');
        assert.equal(find('.random-one').text(), '');
    });
    click('.unrelated-change:eq(0)');
    andThen(() => {
        assert.equal(currentURL(), '/lists');
        assert.equal(find('.list-item-one .item-name').length, 2);
        assert.equal(find('.list-item-one .item-rating').length, 5);
        assert.equal(find('.list-item-one .item-rating:eq(2)').text(), '1');
        assert.equal(find('.list-item-two .item-name').length, 2);
        assert.equal(find('.list-item-two .item-rating').length, 5);
        assert.equal(find('.list-item-two .item-rating:eq(2)').text(), '1');
        assert.equal(find('.list-item-three .item-name').length, 2);
        assert.equal(find('.list-item-three .item-rating').length, 5);
        assert.notEqual(find('.unrelated-one').text(), '');
        assert.equal(find('.random-one').text(), '');
    });
    ajax('/api/lists', 'GET', 200, [{id: 1, name: 'one', reviews: [{rating: 5}, {rating: 5}, {rating: 5}]}, {id: 2, name: 'two', reviews: [{rating: 3}, {rating: 1}]}]);
    click('.refresh-list:eq(0)');
    andThen(() => {
        assert.equal(currentURL(), '/lists');
        assert.equal(find('.list-item-one .item-name').length, 2);
        assert.equal(find('.list-item-one .item-rating').length, 5);
        assert.equal(find('.list-item-one .item-rating:eq(2)').text(), '5');
        assert.equal(find('.list-item-two .item-name').length, 2);
        assert.equal(find('.list-item-two .item-rating').length, 5);
        assert.equal(find('.list-item-two .item-rating:eq(2)').text(), '5');
        assert.equal(find('.list-item-three .item-name').length, 2);
        assert.equal(find('.list-item-three .item-rating').length, 5);
        assert.notEqual(find('.unrelated-one').text(), '');
        assert.equal(find('.random-one').text(), '');
    });
    click('.random-change:eq(0)');
    andThen(() => {
        assert.equal(currentURL(), '/lists');
        assert.equal(find('.list-item-one .item-name').length, 2);
        assert.equal(find('.list-item-one .item-rating').length, 5);
        assert.equal(find('.list-item-two .item-name').length, 2);
        assert.equal(find('.list-item-two .item-rating').length, 5);
        assert.equal(find('.list-item-three .item-name').length, 2);
        assert.equal(find('.list-item-three .item-rating').length, 5);
        assert.notEqual(find('.unrelated-one').text(), '');
        assert.notEqual(find('.random-one').text(), '');
        //each component would render 6x prior
        assert.equal(oneUpdated, 8);
        assert.equal(twoUpdated, 4);
        assert.equal(fourUpdated, 1);
        assert.equal(fiveUpdated, 1);
    });
});
