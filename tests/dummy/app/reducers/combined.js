var combined = function combined(state, action) {
  if (action.type === 'COMBINE') {
    // so we fail the patch reducers test if the
    // patch fails/ or didn't apply as expected
    // return Object.assign({}, state, { done: true });
  }
  return state || { done: false };
};

export default combined;
