import Ember from 'ember';

var combined = function combined(state, action) {
  if (action.type === 'COMBINE') {
    Ember.assert('the reducers patch failed or was not applied');
  }
  return state || { done: false };
};

export default combined;
