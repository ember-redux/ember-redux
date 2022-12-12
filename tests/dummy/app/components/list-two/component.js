import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';
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

var ListTwoComponent = Component.extend({
  layout: hbs`
    {{yield this.items (action "filter")}}
  `
});

export default connect(stateToComputed, dispatchToActions)(ListTwoComponent);
