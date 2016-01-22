export default ((state=3, action) => { // jshint ignore:line
    if(action.type === 'MORE') {
        return state + 1;
    }
    return state;
});
