import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import connect from 'ember-redux/components/connect';

var stateToComputed = (state) => {
  return {
    low: state.low,
    high: state.high
  };
};

var dispatchToActions = (dispatch) => {
  return {
    up: () => dispatch({type: 'UP'}),
    down: () => dispatch({type: 'DOWN'})
  };
};

var CountListComponent = Ember.Component.extend({
  layout: hbs`
    <span class="parent-state">{{low}}</span>
    <button class="btn-up" onclick={{action "up"}}>up</button>
    {{count-detail high=high down=(action "down")}}
    <button class="btn-random" onclick={{action "random"}}>random</button>
    <button class="btn-alter" onclick={{action "alter"}}>alter</button>
    <span class="random-state">{{color}}</span>
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

export default connect(CountListComponent, stateToComputed, dispatchToActions);
