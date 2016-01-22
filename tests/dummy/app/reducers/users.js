import {uniq} from 'dummy/utilities/array';

const initialState = {
    all: []
};

export default ((state=initialState, action) => { // jshint ignore:line
    if (action.type === 'DESERIALIZE_USERS') {
        return {all: uniq(state.all, action.response)};
    }
    return state;
});
