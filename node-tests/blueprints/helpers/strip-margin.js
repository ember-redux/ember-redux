'use strict';

module.exports = function(str) {
  return str[0].split('\n')
    .map(line => line.replace(/^\s*\|/, ''))
    .join('\n');
};
