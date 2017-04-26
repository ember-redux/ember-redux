import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    unrelated: state.list.unrelated
  };
};

var UnrelatedComponent = Ember.Component.extend({
  layout: hbs`
    {{yield unrelated}}
  `
});

export default connect(stateToComputed)(UnrelatedComponent);
