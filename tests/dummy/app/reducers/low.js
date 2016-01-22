export default ((state=0, action) => { // jshint ignore:line
    if(action.type === 'UP') {
        return state + 1;
    }
    return state;
});
