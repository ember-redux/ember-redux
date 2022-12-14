import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    random: state.list.random
  };
};

var RandomComponent = Component.extend({
  layout: hbs`
    {{yield this.random}}
  `
});

export default connect(stateToComputed)(RandomComponent);
