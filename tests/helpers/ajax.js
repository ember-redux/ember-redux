import jQuery from 'jquery';
import { run, later } from '@ember/runloop';
import { settled } from '@ember/test-helpers';

let unhandled = {};

function interceptAjax(hash) {
  let request = unhandled[hash.url];
  if (!request) {
    return;
  }
  let delay = request.responseTime || 0;
  later(() => {
    delete unhandled[hash.url];
    hash.success(request.response);
  }, delay);
}

jQuery.ajax = interceptAjax;

const patchAjax = function patchAjax(url, method, status, response, responseTime) {
  run(function() {
    unhandled[url] = {response: response, responseTime: responseTime};
  });

  return settled();
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
