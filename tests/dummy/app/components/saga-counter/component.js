import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';

var stateToComputed = (state) => {
  return {
    low: state.low
  };
};

var dispatchToActions = (dispatch) => {
  return {
    add: () => dispatch({type: 'ADD'})
  };
};

var SagaComponent = Ember.Component.extend({
    layout: hbs`
      <span class="saga-number">{{low}}</span>
      <button class="btn-saga" onclick={{action "add"}}>add with saga</button>
    `
});

export default connect(stateToComputed, dispatchToActions)(SagaComponent);
