import Ember from 'ember';
import ajax from 'dummy/utilities/ajax';
import { route } from 'ember-redux';

var model = (dispatch, params) => {
  var { item_id } = params;
  return ajax(`/api/items/${item_id}`, 'GET').then(response => dispatch({type: 'DESERIALIZE_ITEM', response: response}));
};

var ItemsDetailRoute = Ember.Route.extend();

export default route({model})(ItemsDetailRoute);
