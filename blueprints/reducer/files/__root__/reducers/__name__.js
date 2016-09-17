import Ember from 'ember';

/**
 * This reducer takes in the localised state which
 * is owned by this reducer; it's job is create a
 * new (non-mutated) state object for this branch of
 * the overall state tree.
 *
 * The "action" is expected to be an Object who's only
 * required property is "type"
 *
 * Note: as best practice you should always assign
 * a default value for state and handle all unknown
 * actions by returning the state back unchanged.
 */
const defaultState = {};
const reducer = (state, action) => {

  switch(action.type) {

    case 'FOO':
      return Ember.assign({}, state, {
        uno: 1,
        dos: 2,
        tres: 3
      });

    case 'BAR':
      return Ember.assign({}, state, {
        uno: 0,
        dos: 0,
        tres: 0
      });

    default:
      return state || defaultState;
  } // end switch

};

export default reducer;
