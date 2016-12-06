import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('counts', { path: '/' });
  this.route('saga', { path: '/saga' });
  this.route('dashboard', { path: '/dashboard' });
  this.route('empty', { path: '/empty' });
  this.route('users', function() {
    this.route('detail', {path: '/:user_id'});
  });
  this.route('items', function() {
    this.route('detail', {path: '/:item_id'});
  });
  this.route('lists', { path: '/lists' });
  this.route('fetch', { path: '/fetch' });
  this.route('super', { path: '/super' });
  this.route('thunk', { path: '/thunk' });
  this.route('simple', { path: '/simple' });
  this.route('project', { path: '/project' });
});

export default Router;
