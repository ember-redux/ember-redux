import Ember from 'ember';
import {uniq} from 'dummy/utilities/array';

const initialState = {
    all: [],
    selected: null
};

export default ((state=initialState, action) => { // jshint ignore:line
    if (action.type === 'DESERIALIZE_USERS') {
        return Ember.assign({}, state, {
            all: uniq(state.all, action.response)
        });
    }
    if (action.type === 'DESERIALIZE_USER') {
        return Ember.assign({}, state, {
            all: uniq(state.all, action.response),
            selected: action.response
        });
    }
    return state;
});
