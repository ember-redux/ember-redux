import Component from '@ember/component';
import { connect } from 'ember-redux';

var stateToComputed = state => ({
  low: state.low
});

class MyClazz extends Component {

  init() {
    super.init(...arguments);
    this.hello = this.low;
  }

}

export default connect(stateToComputed)(MyClazz);
