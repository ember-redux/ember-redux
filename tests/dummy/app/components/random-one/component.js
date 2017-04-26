import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    random: state.list.random
  };
};

var RandomComponent = Ember.Component.extend({
  layout: hbs`
    {{yield random}}
  `
});

export default connect(stateToComputed)(RandomComponent);
