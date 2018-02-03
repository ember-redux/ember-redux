import { run } from '@ember/runloop';
import { test, module } from 'qunit';
import startApp from '../helpers/start-app';
import ajax from '../helpers/ajax';

var application, oneUpdated = 0, oneFakeUpdated = 0, twoUpdated = 0, fourUpdated = 0, fiveUpdated = 0;

module('Acceptance | rerender test', {
  beforeEach() {
    application = startApp();
  },
  afterEach() {
    run(application, 'destroy');
  }
});

test('dispatchToActions will provide `this` context that is the component instance (when not using [phat]Arrow function)', function(assert) {
  ajax('/api/lists', 'GET', 200, [{id: 1, name: 'one', reviews: [{rating: 5}, {rating: 5}]}, {id: 2, name: 'two', reviews: [{rating: 3}, {rating: 1}]}]);
  visit('/lists');
  andThen(() => {
    assert.equal(currentURL(), '/lists');
    assert.equal(find('.fake-contextt').text(), '');
  });
  click('.btn-contextt');
  andThen(() => {
    assert.equal(currentURL(), '/lists');
    assert.equal(find('.fake-contextt').text(), 'contextt ... abc123');
  });
});

test('should only rerender when connected component is listening for each state used to compute', function(assert) {
  ajax('/api/lists', 'GET', 200, [{id: 1, name: 'one', reviews: [{rating: 5}, {rating: 5}]}, {id: 2, name: 'two', reviews: [{rating: 3}, {rating: 1}]}]);
  visit('/lists');
  andThen(() => {
    assert.equal(currentURL(), '/lists');
    assert.equal(find('.list-item-one .item-name').length, 2);
    assert.equal(find('.list-item-one .item-rating').length, 4);
    assert.equal(find('.list-item-one .fake-value').text(), 1);
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
    componentOne.addObserver('items', function() { this.get('items'); oneUpdated++; });
    componentOne.addObserver('fake', function() { this.get('fake'); oneFakeUpdated++; });
    componentTwo.addObserver('items', function() { this.get('items'); twoUpdated++; });
    componentFour.addObserver('unrelated', function() { this.get('unrelated'); fourUpdated++; });
    componentFive.addObserver('random', function() { this.get('random'); fiveUpdated++; });
  });
  click('.filter-list:eq(0)');
  andThen(() => {
    assert.equal(currentURL(), '/lists');
    assert.equal(find('.list-item-one .item-name').length, 1);
    assert.equal(find('.list-item-one .item-rating').length, 2);
    assert.equal(find('.list-item-one .fake-value').text(), 1);
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
    assert.equal(find('.list-item-one .fake-value').text(), 1);
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
    assert.equal(find('.list-item-one .fake-value').text(), 1);
    assert.equal(find('.list-item-one .item-rating:eq(2)').text(), '1');
    assert.equal(find('.list-item-two .item-name').length, 2);
    assert.equal(find('.list-item-two .item-rating').length, 5);
    assert.equal(find('.list-item-two .item-rating:eq(2)').text(), '1');
    assert.equal(find('.list-item-three .item-name').length, 2);
    assert.equal(find('.list-item-three .item-rating').length, 5);
    assert.equal(find('.list-item-three .fake-value').text(), 1);
    assert.equal(find('.unrelated-one').text(), '');
    assert.equal(find('.random-one').text(), '');
  });
  click('.unrelated-change:eq(0)');
  andThen(() => {
    assert.equal(currentURL(), '/lists');
    assert.equal(find('.list-item-one .item-name').length, 2);
    assert.equal(find('.list-item-one .item-rating').length, 5);
    assert.equal(find('.list-item-one .fake-value').text(), 1);
    assert.equal(find('.list-item-one .item-rating:eq(2)').text(), '1');
    assert.equal(find('.list-item-two .item-name').length, 2);
    assert.equal(find('.list-item-two .item-rating').length, 5);
    assert.equal(find('.list-item-two .item-rating:eq(2)').text(), '1');
    assert.equal(find('.list-item-three .item-name').length, 2);
    assert.equal(find('.list-item-three .item-rating').length, 5);
    assert.equal(find('.list-item-three .fake-value').text(), 1);
    assert.notEqual(find('.unrelated-one').text(), '');
    assert.equal(find('.random-one').text(), '');
  });
  ajax('/api/lists', 'GET', 200, [{id: 1, name: 'one', reviews: [{rating: 5}, {rating: 5}, {rating: 5}]}, {id: 2, name: 'two', reviews: [{rating: 3}, {rating: 1}]}]);
  click('.refresh-list:eq(0)');
  andThen(() => {
    assert.equal(currentURL(), '/lists');
    assert.equal(find('.list-item-one .item-name').length, 2);
    assert.equal(find('.list-item-one .item-rating').length, 5);
    assert.equal(find('.list-item-one .fake-value').text(), 1);
    assert.equal(find('.list-item-one .item-rating:eq(2)').text(), '5');
    assert.equal(find('.list-item-two .item-name').length, 2);
    assert.equal(find('.list-item-two .item-rating').length, 5);
    assert.equal(find('.list-item-two .item-rating:eq(2)').text(), '5');
    assert.equal(find('.list-item-three .item-name').length, 2);
    assert.equal(find('.list-item-three .item-rating').length, 5);
    assert.equal(find('.list-item-three .fake-value').text(), 1);
    assert.notEqual(find('.unrelated-one').text(), '');
    assert.equal(find('.random-one').text(), '');
  });
  click('.random-change:eq(0)');
  andThen(() => {
    assert.equal(currentURL(), '/lists');
    assert.equal(find('.list-item-one .item-name').length, 2);
    assert.equal(find('.list-item-one .item-rating').length, 5);
    assert.equal(find('.list-item-one .fake-value').text(), 1);
    assert.equal(find('.list-item-two .item-name').length, 2);
    assert.equal(find('.list-item-two .item-rating').length, 5);
    assert.equal(find('.list-item-three .item-name').length, 2);
    assert.equal(find('.list-item-three .item-rating').length, 5);
    assert.equal(find('.list-item-three .fake-value').text(), 1);
    assert.notEqual(find('.unrelated-one').text(), '');
    assert.notEqual(find('.random-one').text(), '');
    assert.equal(oneUpdated, 4);
    assert.equal(oneFakeUpdated, 0);
    assert.equal(twoUpdated, 4);
    assert.equal(fourUpdated, 1);
    assert.equal(fiveUpdated, 1);
  });
  click('.fake-change:eq(0)');
  click('.fake-change:eq(0)');
  click('.fake-change:eq(0)');
  click('.fake-change:eq(0)');
  andThen(() => {
    assert.equal(currentURL(), '/lists');
    assert.equal(find('.list-item-one .item-name').length, 2);
    assert.equal(find('.list-item-one .item-rating').length, 5);
    assert.equal(find('.list-item-one .fake-value').text(), 5);
    assert.equal(find('.list-item-two .item-name').length, 2);
    assert.equal(find('.list-item-two .item-rating').length, 5);
    assert.equal(find('.list-item-three .item-name').length, 2);
    assert.equal(find('.list-item-three .item-rating').length, 5);
    assert.equal(find('.list-item-three .fake-value').text(), 5);
    assert.notEqual(find('.unrelated-one').text(), '');
    assert.notEqual(find('.random-one').text(), '');
    assert.equal(oneUpdated, 4);
    assert.equal(oneFakeUpdated, 4);
    assert.equal(twoUpdated, 4);
    assert.equal(fourUpdated, 1);
    assert.equal(fiveUpdated, 1);
  });
});
