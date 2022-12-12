import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = (state) => {
  return {
    unrelated: state.list.unrelated
  };
};

var UnrelatedComponent = Component.extend({
  layout: hbs`
    {{yield this.unrelated}}
  `
});

export default connect(stateToComputed)(UnrelatedComponent);
