import Ember from 'ember';

var ApplicationRoute = Ember.Route.extend({
    store: Ember.inject.service('redux'),
    beforeModel() {
        let store = this.get('store');
        let roles = Ember.$('[preload-roles]').data('configuration');
        roles.forEach((model) => {
            store.dispatch({type: 'ADD_ROLE', response: model});
        });
    }
});

export default ApplicationRoute;
