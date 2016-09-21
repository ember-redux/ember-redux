const initialState = {
    all: [],
    filter: null,
    unrelated: null,
    random: null
};

export default ((state, action) => {
    if (action.type === 'TRANSFORM_LIST') {
        return Object.assign({}, state, {
            all: action.response
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
    if (action.type === 'RANDOM_UPDATE') {
        return Object.assign({}, state, {
            random: Math.random(),
            all: state.all,
            filter: state.filter,
            unrelated: state.unrelated
        });
    }
    return state || initialState;
});
