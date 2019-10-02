import { run, join } from '@ember/runloop';
import RSVP from 'rsvp';

const { Promise } = RSVP;

// jQuery compat
window.$ = {};
window.$.ajax = (hash) => fetch(hash.url, hash);

var configureAjaxDefaults = function(hash) {
  let options = {};

  options = {
    method: hash.method || 'GET', // default
    cache: hash.cache || 'no-cache', // default
  }

  if (hash.data) {
    options.body = JSON.stringify(hash.data);
  }

  if (!hash.contentType && hash.data) {
    options.headers['Content-Type'] = 'application/json';
  }

  return options;
};

export default function(url, method, hash) {
  var self = this;

  hash = hash || {};
  hash.method = method;

  let options = configureAjaxDefaults(hash);

  return new Promise(function(resolve, reject) {
    (async () => {
      let response;
      let json;
      try {
        response = await fetch(url, options);
        json = await response.json();

        return join(null, resolve, json);
      } catch (e) {
        run(self, "onError", json, response.textStatus, e);
        return join(null, reject, json);
      }
    })();
  });
}
