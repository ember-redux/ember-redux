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
