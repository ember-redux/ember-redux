const initialState = {
  all: [],
  filter: null,
  unrelated: null,
  random: null,
  fake: 1
};

export default ((state, action) => {
  if (action.type === 'TRANSFORM_LIST') {
    return Object.assign({}, state, {
      all: action.response
    });
  }
  if (action.type === 'FAKE_UPDATE') {
    return Object.assign({}, state, {
      fake: state.fake + 1
    });
  }
  if (action.type === 'FILTER_LIST') {
    return Object.assign({}, state, {
      filter: action.filter
    });
  }
  if (action.type === 'UNRELATED_UPDATE') {
    return Object.assign({}, state, {
      unrelated: `unrelated ... ${Math.random()}`
    });
  }
  if (action.type === 'THIS_CONTEXT_EXAMPLE') {
    return Object.assign({}, state, {
      contextt: `contextt ... ${action.value}`
    });
  }
  if (action.type === 'RANDOM_UPDATE') {
    return Object.assign({}, state, {
      random: Math.random(),
      all: state.all,
      filter: state.filter,
      unrelated: state.unrelated,
      fake: state.fake,
      contextt: state.contextt
    });
  }
  return state || initialState;
});
