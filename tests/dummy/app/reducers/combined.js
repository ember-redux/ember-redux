import { assert } from '@ember/debug';

var combined = function combined(state, action) {
  if (action.type === 'COMBINE') {
    assert('the reducers patch failed or was not applied');
  }
  return state || { done: false };
};

export default combined;
