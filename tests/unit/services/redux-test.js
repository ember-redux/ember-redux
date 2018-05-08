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

});
