import Ember from 'ember';

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
    return new Ember.RSVP.Promise(function(resolve, reject) {
        hash.success = function(json) {
            return Ember.run.join(null, resolve, json); //try w/ integration
        };
        hash.error = function(json, textStatus, errorThrown) {
            if (json && json.then) {
                json.then = null;
            }
            Ember.run(self, "onError", json, textStatus, errorThrown);
            return Ember.run.join(null, reject, json);
        };
        Ember.$.ajax(hash);
    });
}
