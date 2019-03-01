import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('counts', { path: '/' });
  this.route('saga', { path: '/saga' });
  this.route('dashboard', { path: '/dashboard' });
  this.route('empty', { path: '/empty' });
  this.route('init', { path: '/init' });
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
  this.route('actionz', { path: '/actionz' });
  this.route('clazz', { path: '/clazz' });
  this.route('query-params', { path: '/query-params' });
  this.route('clazz-actionz', { path: '/clazz-actionz' });
  this.route('clazz-factorie', { path: '/clazz-factorie' });
});

export default Router;
