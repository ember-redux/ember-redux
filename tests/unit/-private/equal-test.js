import { module, test } from 'qunit';
import shallowEqual from 'ember-redux/-private/equal';

var result;

module('Unit | Private | Equal');

test('should return true if arguments fields are equal', (assert) => {
    result = shallowEqual(
        { a: 1, b: 2, c: undefined },
        { a: 1, b: 2, c: undefined }
    );
    assert.equal(result, true);

    result = shallowEqual(
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 }
    );
    assert.equal(result, true);

    const o = {};
    result = shallowEqual(
        { a: 1, b: 2, c: o },
        { a: 1, b: 2, c: o }
    );
    assert.equal(result, true);

    const d = function () { return 1; };
    result = shallowEqual(
        { a: 1, b: 2, c: o, d: d },
        { a: 1, b: 2, c: o, d: d }
    );
    assert.equal(result, true);
});

test('should return false if arguments fields are different function identities', (assert) => {
    result = shallowEqual(
        { a: 1, b: 2, d: function () { return 1; } },
        { a: 1, b: 2, d: function () { return 1; } }
    );
    assert.equal(result, false);
});

test('should return false if first argument has too many keys', (assert) => {
    result = shallowEqual(
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2 }
    );
    assert.equal(result, false);
});

test('should return false if second argument has too many keys', (assert) => {
    result = shallowEqual(
        { a: 1, b: 2 },
        { a: 1, b: 2, c: 3 }
    );
    assert.equal(result, false);
});

test('should return false if arguments have different keys', (assert) => {
    result = shallowEqual(
        { a: 1, b: 2, c: undefined },
        { a: 1, bb: 2, c: undefined }
    );
    assert.equal(result, false);
});
