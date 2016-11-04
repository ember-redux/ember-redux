import Ember from 'ember';
import { test, module } from 'qunit';
import startApp from '../helpers/start-app';

var application, oneUpdated = 0, twoUpdated = 0, fourUpdated = 0, fiveUpdated = 0;

module('Acceptance | rerender test', {
    beforeEach() {
        application = startApp();
    },
    afterEach() {
        Ember.run(application, 'destroy');
    }
});

test('should rerender when state is changed by other redux consumers', function(assert) {
  const redux = application.__container__.lookup('service:redux');
  ajax('/api/lists', 'GET', 200, []);

  visit('/lists');

  andThen(() => {
    assert.equal(find('.list-item-one .item-name').length, 0, "No items initially");

    redux.dispatch({type: 'TRANSFORM_LIST', response: [{id: 1, name: 'bob', reviews: [{rating: 5}]}]});

    andThen(() => {
      assert.equal(find('.list-item-one .item-name').length, 1, "One item after redux dispatch");
    });
  });
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
        var componentOne = application.__container__.lookup('component:list-one');
        var componentTwo = application.__container__.lookup('component:list-two');
        var componentFour = application.__container__.lookup('component:unrelated-one');
        var componentFive = application.__container__.lookup('component:random-one');
        var original = componentOne.updateProps;
        componentOne.updateProps = function() {
            oneUpdated = oneUpdated + 1;
            return original.apply(this, arguments);
        };
        componentTwo.updateProps = function() {
            twoUpdated = twoUpdated + 1;
            return original.apply(this, arguments);
        };
        componentFour.updateProps = function() {
            fourUpdated = fourUpdated + 1;
            return original.apply(this, arguments);
        };
        componentFive.updateProps = function() {
            fiveUpdated = fiveUpdated + 1;
            return original.apply(this, arguments);
        };
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
        assert.equal(oneUpdated, 3);
        assert.equal(twoUpdated, 3);
        assert.equal(fourUpdated, 1);
        assert.equal(fiveUpdated, 1);
    });
});
