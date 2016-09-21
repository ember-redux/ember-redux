import Ember from 'ember';
import ajax from 'dummy/utilities/ajax';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';
import filterRating from 'dummy/utilities/filter';

var stateToComputed = (state) => {
  return {
    items: filterRating(state.list.all, state.list.filter)
  };
};

var dispatchToActions = (dispatch) => {
  return {
    filter: (filter) => dispatch({type: 'FILTER_LIST', filter: filter}),
    refresh: () => ajax('/api/lists', 'GET').then(response => dispatch({type: 'TRANSFORM_LIST', response: response})),
    update: () => dispatch({type: 'UNRELATED_UPDATE'}),
    random: () => dispatch({type: 'RANDOM_UPDATE'})
  };
};

var ListOneComponent = Ember.Component.extend({
    layout: hbs`
        {{yield items (action "filter") (action "refresh") (action "update") (action "random")}}
    ` 
});

export default connect(stateToComputed, dispatchToActions)(ListOneComponent);
