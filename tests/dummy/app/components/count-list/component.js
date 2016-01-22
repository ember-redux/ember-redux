import Ember from 'ember';
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
    actions: {
        random() {
            this.set('color', 'blue');
            //only used in test code to verify actions worked
        }
    }
});

export default connect(stateToComputed, dispatchToActions)(CountListComponent);
