import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';
import { bumpTwice } from '../../actions/index';

var stateToComputed = function(state) {
  return {
    low: state.low
  };
};

var mapDispatchToActions = {
  bumpTwice
};

var LessBoilerplateComponent = Ember.Component.extend({
  layout: hbs`
    <span class="upp-low">{{low}}</span>
    <button class="btn-upp" onclick={{action "bumpTwice" 1}}>upp</button>
  `
});

export default connect(stateToComputed, mapDispatchToActions)(LessBoilerplateComponent);
