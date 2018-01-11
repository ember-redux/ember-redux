import Component from '@ember/component';
import { connect } from 'ember-redux';

const makeUniqueSelector = () => {
  return (state) => state.low;
}

const stateToComputedFactory = () => {
  const selectItemHereOnly = makeUniqueSelector();
  return (state) => {
    const low = selectItemHereOnly(state);
    return {
      low
    }
  }
}

const dispatchToActions = dispatch => ({
  up: () => dispatch({type: 'UP'})
});

class MyClazzzz extends Component {
  constructor() {
    super(...arguments);
    this.color = 'white';
  }
}

export default connect(stateToComputedFactory, dispatchToActions)(MyClazzzz);
