import Component from '@glimmer/component';
import { connect } from 'ember-redux';
import { bumpTwice } from '../../actions/index';

var stateToComputed = function(state) {
  return {
    low: state.low
  };
};

var dispatchToActions = {
  bumpTwice
};

class MyClazz extends Component {
  constructor() {
    super(...arguments);
    this.color = 'orange';
  }
}

export default connect(stateToComputed, dispatchToActions)(MyClazz);
