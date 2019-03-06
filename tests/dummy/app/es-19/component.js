import Component from '@ember/component';
import { connect } from 'ember-redux';

const stateToComputed = state => ({
  low: state.low
});

class MyEs19 extends Component {
  init() {
    super.init(...arguments);
    this.hello = this.low;
  }
}

export default connect(stateToComputed)(MyEs19);
