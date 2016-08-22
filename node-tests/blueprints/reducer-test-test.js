'use strict';

var blueprintHelpers     = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks       = blueprintHelpers.setupTestHooks;
var emberNew             = blueprintHelpers.emberNew;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;
var expect               = require('ember-cli-blueprint-test-helpers/chai').expect;
var stripMargin          = require('./helpers/strip-margin');

const TEST_FILE_PATH = 'tests/unit/reducers/foo-test.js';

describe('Acceptance: ember generate and destroy reducer-test', function() {

  setupTestHooks(this);

  it('reducer-test', function() {

    return emberNew()
      .then(() => emberGenerateDestroy(['reducer-test', 'foo'], (file) => {
        expect(file(TEST_FILE_PATH)).to.equal(
          stripMargin`|import reducer from 'my-app/reducers/foo';
                      |import { module, test } from 'qunit';
                      |
                      |module('Unit | Reducer | foo');
                      |
                      |test('initial state', function(assert) {
                      |  assert.expect(1);
                      |
                      |  assert.deepEqual(reducer(undefined, {}),
                      |    {}, //replace with actual value
                      |  'foo reducer returns the correct initial state');
                      |});\n`
          );
    }));
  });
});
