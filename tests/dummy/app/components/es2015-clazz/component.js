import Component from '@ember/component';
import { connect } from 'ember-redux';

const stateToComputed = state => ({
  low: state.low
});

const dispatchToActions = dispatch => ({
  up: () => dispatch({type: 'UP'})
});

class MyClazz extends Component {
  constructor() {
    super(...arguments);
    this.color = 'orange';
  }
}

export default connect(stateToComputed, dispatchToActions)(MyClazz);
