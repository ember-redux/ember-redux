import { moduleFor, test } from 'ember-qunit';

moduleFor('service:redux', 'Unit | Service | redux');

test('should initialize store', function(assert) {
  const service = this.subject();
  assert.ok(service.store);
});

test('should return the action on dispatch', function(assert) {
  const service = this.subject();
  const dispatchResult = service.dispatch({ type: 'DUMMY' });
  assert.deepEqual(dispatchResult, { type: 'DUMMY' });
});

test('should replace the store\'s reducer', function(assert) {
  const service = this.subject();

  service.replaceReducer(() => {
    return 'DUMMY_REDUCER_1';
  });
  assert.equal(service.getState(), 'DUMMY_REDUCER_1');

  service.replaceReducer(() => {
    return 'DUMMY_REDUCER_2';
  });
  assert.equal(service.getState(), 'DUMMY_REDUCER_2');
});
