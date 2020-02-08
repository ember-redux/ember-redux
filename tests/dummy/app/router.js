import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('counts', { path: '/' });
  this.route('saga');
  this.route('dashboard');
  this.route('empty');
  this.route('init');
  this.route('es2015');
  this.route('users', function() {
    this.route('detail', {path: '/:user_id'});
  });
  this.route('items', function() {
    this.route('detail', {path: '/:item_id'});
  });
  this.route('lists');
  this.route('fetch');
  this.route('super');
  this.route('thunk');
  this.route('simple');
  this.route('actionz');
  this.route('clazz');
  this.route('query-params');
  this.route('clazz-actionz');
  this.route('clazz-factorie');
  this.route('octane-factorie');
  this.route('octane-actionz');
});
