import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';
import filterRating from 'dummy/utilities/filter';

var stateToComputed = (state) => {
  return {
    items: filterRating(state.list.all, state.list.filter),
    filter: state.list.filter
  };
};

var dispatchToActions = (dispatch) => {
  return {
    filter: (filter) => dispatch({type: 'FILTER_LIST', filter: filter})
  };
};

var ListTwoComponent = Ember.Component.extend({
    layout: hbs`
        {{yield items (action "filter")}}
    ` 
});

export default connect(stateToComputed, dispatchToActions)(ListTwoComponent);
