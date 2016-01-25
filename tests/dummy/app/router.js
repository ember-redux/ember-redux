import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('counts', { path: '/' });
  this.route('dashboard', { path: '/dashboard' });
  this.route('empty', { path: '/empty' });
  this.route('users', function() {
      this.route('detail', {path: '/:user_id'});
  });
  this.route('fetch', { path: '/fetch' });
});

export default Router;
