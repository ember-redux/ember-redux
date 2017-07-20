import { warn } from '@ember/debug';
import connect from '../connect';

export default function deprecatedConnect(...args) {
  warn(
    "The ember-redux `connect` function has been moved to `ember-redux`. Please update your imports to `import { connect } from 'ember-redux';`",
    false,
    { id: 'ember-redux.connect-import' }
  );

  return connect(...args);
}
