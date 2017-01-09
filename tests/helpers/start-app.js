import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

function ajax(app, url, method, status, response, data, options = {}) {
  Ember.run(function() {
    Ember.$.fauxjax.removeExisting(url, method);
    var request = { url: url , method: method };
    if (data) {
      request.data = data;
      request.contentType = 'application/json';
    }
    Ember.$.fauxjax.new({
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

Ember.Test.registerAsyncHelper('ajax', ajax);

export default function startApp(attrs) {
  let application;

  // use defaults, but you can override
  let attributes = Object.assign({}, config.APP, attrs);

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
