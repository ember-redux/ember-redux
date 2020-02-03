import Component from '@glimmer/component';
import { action, computed } from '@ember/object';
import { connect } from 'ember-redux';
import { tracked } from '@glimmer/tracking';

const stateToComputed = (state, args) => {
  return () => ({
    number: state.low,
    name: args.name
  })
};

const dispatchToActions = (dispatch) => {
  return {
    up: () => dispatch({type: 'UP'})
  };
};

class MyClazz extends Component {

  @tracked color;

  constructor() {
    super(...arguments);
    this.color = 'green';
  }

  get fullName() {
    return this.args.name || 'full name'
  }

  @computed('number')
  get intoFive() {
    return this.number * 5;
  }

  @computed('args.name')
  get sayHi() {
    return 'Hi ' + this.name;
  }

  @action
  go() {
    this.actions.up();
  }

  @action
  random() {
    this.color = 'yellow';
  }
}

export default connect(stateToComputed, dispatchToActions)(MyClazz);
