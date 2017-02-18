import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | route hooks');

test('route hooks such as afterModel should have all its params be accessible in a connect', function(assert) {
  visit('/items');

  andThen(function() {
    assert.equal(currentURL(), '/items');

    assert.equal(find('#after-model-transition').text(), 'ok');
  });
});

test('route properties such as queryParams should be accessible in a connect', function(assert) {
  visit('/query-params');

  andThen(function() {
    assert.equal(currentURL(), '/query-params');

    assert.equal(find('.query-param-name').text(), 'foo');
  });
});
