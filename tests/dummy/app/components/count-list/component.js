import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { connect } from 'ember-redux';

var stateToComputed = function(state, attrs) {
  var component = this;
  return {
    low: state.low,
    high: state.high,
    combined: state.combined.done,
    greeting: `Welcome back, ${attrs.name}!`,
    serviced: component.get('fake.serviced'),
    dyno: `name: ${component.get('dynoName')}`
  };
};

var dispatchToActions = (dispatch) => {
  return {
    up: () => dispatch({type: 'UP'}),
    down: () => dispatch({type: 'DOWN'}),
    combine: () => dispatch({type: 'COMBINE'})
  };
};

var CountListComponent = Ember.Component.extend({
  dynoNameValue: null,
  dynoName: Ember.computed('dynoNameValue', function() {
    return this.get('dynoNameValue');
  }),
  fake: Ember.inject.service(),
  layout: hbs`
    <span class="parent-state">{{low}}</span>
    <button class="btn-up" onclick={{action "up"}}>up</button>
    {{count-detail high=high down=(action "down")}}
    <button class="btn-combine" onclick={{action "combine"}}>combine</button>
    <button class="btn-random" onclick={{action "random"}}>random</button>
    <button class="btn-alter" onclick={{action "alter"}}>alter</button>
    <span class="random-state">{{color}}</span>
    <span class="greeting">{{greeting}}</span>
    <span class="serviced">{{serviced}}</span>
    <span class="dyno">{{dyno}}</span>
    <span class="combined">{{combined}}</span>
  `,
  actions: {
    alter() {
      this.set('low', '999');
    },
    random() {
      this.set('color', 'blue');
      //only used in test code to verify actions worked
    }
  }
});

export default connect(stateToComputed, dispatchToActions)(CountListComponent);
