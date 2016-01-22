import Ember from 'ember';
import ajax from 'dummy/utilities/ajax';
import connect from 'ember-redux/components/connect';

var stateToComputed = (state) => {
    return {
        users: state.users.all
    };
};

var dispatchToActions = (dispatch) => {
    return {
        fetch: () => ajax('/api/users', 'GET').then(response => dispatch({type: 'DESERIALIZE_USERS', response: response}))
    };
};

var UserListComponent = Ember.Component.extend({
    init() {
        this._super(...arguments);
        this.triggerAction({action: 'fetch', target: this});
    }
});

export default connect(stateToComputed, dispatchToActions)(UserListComponent);
