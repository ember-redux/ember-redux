import reducer from '<%= dasherizedModulePrefix %>/reducers/<%= dasherizedModuleName %>';
import { module, test } from 'qunit';

module('<%= friendlyTestName %>');

test('initial state', function(assert) {
  assert.expect(1);

  assert.deepEqual(reducer(undefined, {}),
    {}, //replace with actual value
  '<%= camelizedModuleName %> reducer returns the correct initial state');
});
