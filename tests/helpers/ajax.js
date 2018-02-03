import $ from 'jquery';
import { run, later } from '@ember/runloop';
import wait from 'ember-test-helpers/wait';

let unhandled = {};

function interceptAjax(hash) {
  let request = unhandled[hash.url];
  let delay = request.responseTime || 0;
  later(() => {
    delete unhandled[hash.url];
    hash.success(request.response);
  }, delay);
}

$.ajax = interceptAjax;

const patchAjax = function patchAjax(url, method, status, response, responseTime) {
  run(function() {
    unhandled[url] = {response: response, responseTime: responseTime};
  });

  return wait();
}

export default function ajax(url, method, status, response, responseTime) {
  if (unhandled[url]) {
    setTimeout(() => {
      return ajax(url, method, status, response, responseTime);
    }, 0);
  } else {
    return patchAjax(url, method, status, response, responseTime);
  }
}
