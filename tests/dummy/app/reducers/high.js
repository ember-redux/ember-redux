export default ((state=9, action) => { // jshint ignore:line
    if(action.type === 'DOWN') {
        return state - 1;
    }
    return state;
});
