import $ from 'jquery';
import { run } from '@ember/runloop';
import { merge } from '@ember/polyfills';
import { registerAsyncHelper } from '@ember/test';
import Application from '../../app';
import config from '../../config/environment';

function ajax(app, url, method, status, response, data, options = {}) {
  run(function() {
    $.fauxjax.removeExisting(url, method);
    var request = { url: url , method: method };
    if (data) {
      request.data = data;
      request.contentType = 'application/json';
    }
    $.fauxjax.new({
      request: request,
      response: {
        status: status,
        content: response,
        responseTime: options.responseTime
      }
    });
  });
  return app.testHelpers.wait();
}

registerAsyncHelper('ajax', ajax);

export default function startApp(attrs) {
  let attributes = merge({}, config.APP);
  attributes = merge(attributes, attrs); // use defaults, but you can override;

  return run(() => {
    let application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
    return application;
  });
}
