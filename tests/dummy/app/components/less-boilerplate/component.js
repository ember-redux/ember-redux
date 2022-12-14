import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';
import { bumpTwice } from '../../actions/index';

var stateToComputed = function(state) {
  return {
    low: state.low
  };
};

var mapDispatchToActions = {
  bumpTwice
};

var LessBoilerplateComponent = Component.extend({
  layout: hbs`
    <span class="upp-low">{{this.low}}</span>
    <button class="btn-upp" onclick={{action "bumpTwice" 1}}>upp</button>
  `
});

export default connect(stateToComputed, mapDispatchToActions)(LessBoilerplateComponent);
