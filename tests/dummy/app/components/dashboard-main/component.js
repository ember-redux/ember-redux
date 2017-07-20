import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    all: state.all
  };
};

var dispatchToActions = (dispatch) => {
  return {
    more: () => dispatch({type: 'MORE'})
  };
};

var DashboardMainComponent = Component.extend({
  layout: hbs`
    <span>dashboard</span>
  `
});

export default connect(stateToComputed, dispatchToActions)(DashboardMainComponent);
