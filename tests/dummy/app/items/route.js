import Ember from 'ember';
import ajax from 'dummy/utilities/ajax';
import route from 'ember-redux/route';

var model = (dispatch) => {
    return ajax('/api/items', 'GET').then(response => dispatch({type: 'DESERIALIZE_ITEMS', response: response}));
};

var ItemsRoute = Ember.Route.extend();

export default route({model})(ItemsRoute);
