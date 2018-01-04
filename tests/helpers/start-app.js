import $ from 'jquery';
import { run, later } from '@ember/runloop';
import { merge } from '@ember/polyfills';
import { registerAsyncHelper } from '@ember/test';
import Application from '../../app';
import config from '../../config/environment';

let unhandled = {};

function interceptAjax(hash) {
  let request = unhandled[hash.url];
  let delay = request.responseTime || 0;
  later(() => {
    hash.success(request.response);
  }, delay);
}

$.ajax = interceptAjax;

function ajax(app, url, method, status, response, responseTime) {
  run(function() {
    unhandled[url] = {response: response, responseTime: responseTime};
  });
  return app.testHelpers.wait();
}

registerAsyncHelper('ajax', ajax);

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes.autoboot = true;
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
