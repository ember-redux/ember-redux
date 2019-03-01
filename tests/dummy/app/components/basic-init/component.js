import Component from '@ember/component';
import { get } from '@ember/object';
import { connect } from 'ember-redux';

var stateToComputed = function(state) {
  return {
    low: state.low
  };
};

var ConnectComponent = Component.extend({

  init() {
    this._super(...arguments);
    this.hello = get(this, 'low');
  }

});

export default connect(stateToComputed)(ConnectComponent);
