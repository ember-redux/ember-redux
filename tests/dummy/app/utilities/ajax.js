import jQuery from 'jquery';
import { run, join } from '@ember/runloop';
import RSVP from 'rsvp';

const { Promise } = RSVP;

var configureAjaxDefaults = function(hash) {
  hash.method = hash.method || "GET";
  hash.dataType = hash.dataType || "json";
  hash.cache = hash.cache || false;
  if(!hash.contentType && hash.data) {
    hash.contentType = "application/json";
  }
  return hash;
};

export default function(url, method, hash) {
  var self = this;
  hash = hash || {};
  hash.url = url;
  hash.method = method;
  hash = configureAjaxDefaults(hash);
  return new Promise(function(resolve, reject) {
    hash.success = function(json) {
      return join(null, resolve, json); //try w/ integration
    };
    hash.error = function(json, textStatus, errorThrown) {
      if (json && json.then) {
        json.then = null;
      }
      run(self, "onError", json, textStatus, errorThrown);
      return join(null, reject, json);
    };
    jQuery.ajax(hash);
  });
}
