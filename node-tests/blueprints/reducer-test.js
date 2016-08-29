'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var emberNew         = blueprintHelpers.emberNew;
var emberDestroy     = blueprintHelpers.emberDestroy;
var emberGenerate    = blueprintHelpers.emberGenerate;
var setupTestHooks   = blueprintHelpers.setupTestHooks;
var expect           = require('ember-cli-blueprint-test-helpers/chai').expect;
var file             = require('ember-cli-blueprint-test-helpers/chai').file;
var stripMargin      = require('./helpers/strip-margin');
var fs               = require('fs');

const REDUCER_INDEX_PATH = 'app/reducers/index.js';

describe('Acceptance: ember generate and destroy reducer', function() {

  setupTestHooks(this);

  it('reducer', function() {

    return emberNew()
      .then(() => {
          //TODO replace this step with default blueprint once issue fixed
          //https://github.com/ember-cli/ember-cli-internal-test-helpers/issues/22
          fs.mkdirSync('app/reducers');
          fs.writeFileSync(REDUCER_INDEX_PATH,
            stripMargin`|export default {};
                        |\n`
          );
      })
      .then(() => emberGenerate((['reducer', 'foo'])))
      .then(() => emberGenerate((['reducer', 'foo']))) //test duplicate
      .then(() => {
          /* jshint expr:true */
          expect(file('app/reducers/foo.js')).to.exist;
          /* jshint expr:false */
          expect(file(REDUCER_INDEX_PATH)).to.equal(
            stripMargin`|import foo from "./foo";
                        |export default {
                        |  foo
                        |};
                        |\n`
          );
      })
      .then(() => emberGenerate((['reducer', 'bar'])))
      .then(() => {
          /* jshint expr:true */
          expect(file('app/reducers/bar.js')).to.exist;
          /* jshint expr:false */
          expect(file(REDUCER_INDEX_PATH)).to.equal(
            stripMargin`|import foo from "./foo";
                        |import bar from "./bar";
                        |export default {
                        |  foo,
                        |  bar
                        |};
                        |\n`
          );
      })
      .then(() => emberDestroy((['reducer', 'foo'])))
      .then(() => emberDestroy((['reducer', 'foo']))) //test duplicate
      .then(() => {
          expect(file(REDUCER_INDEX_PATH)).to.equal(
            stripMargin`|import bar from "./bar";
                        |export default {
                        |  bar
                        |};
                        |\n`
          );
      })
      .then(() => emberDestroy((['reducer', 'bar'])))
      .then(() => {
          expect(file(REDUCER_INDEX_PATH)).to.equal(
            stripMargin`|export default {};
                        |\n`
          );
      });
  });
});
