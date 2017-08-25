/*global ajax:true*/

import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { test } from 'qunit';

moduleForAcceptance('Acceptance | thunk dispatch test', {
  beforeEach() {
    window.loadingInvoked = false;
  }
});

test('route loads data with Ember loading state', function(assert) {
  assert.expect(4);

  const usersData = [{id: 1, name: 'one'}, {id: 2, name: 'two'}];
  // Use a delay here so that we force entry into Ember's route loading state.
  ajax('/api/users', 'GET', 200, usersData, 500);

  visit('/');
  andThen(() => {
    assert.equal(currentURL(), '/');
  });
  click('.thunk-link');
  andThen(() => {
    assert.equal(currentURL(), '/thunk');
    assert.equal(find('.user-name').length, 2);
    assert.ok(window.loadingInvoked, 'Ember model loading hook is invoked.');
  });
});
