import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | redux', function(hooks) {
  setupTest(hooks);

  test('should initialize store', function(assert) {
    const service = this.owner.lookup('service:redux');
    assert.ok(service.store);
  });

  test('should return the action on dispatch', function(assert) {
    const service = this.owner.lookup('service:redux');
    const dispatchResult = service.dispatch({ type: 'DUMMY' });
    assert.deepEqual(dispatchResult, { type: 'DUMMY' });
  });

  test('should replace the store\'s reducer', function(assert) {
    const service = this.owner.lookup('service:redux');

    service.replaceReducer(() => {
      return 'DUMMY_REDUCER_1';
    });
    assert.equal(service.getState(), 'DUMMY_REDUCER_1');

    service.replaceReducer(() => {
      return 'DUMMY_REDUCER_2';
    });
    assert.equal(service.getState(), 'DUMMY_REDUCER_2');
  });
});