import ajax from 'dummy/utilities/ajax';
import route from 'ember-redux/route';

var model = (dispatch) => {
    return ajax('/api/lists', 'GET').then(response => dispatch({type: 'TRANSFORM_LIST', response: response}));
};

export default route({model})();
