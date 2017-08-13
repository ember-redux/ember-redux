import { combineReducers } from 'redux';
import low from 'dummy/reducers/low';
import high from 'dummy/reducers/high';
import combined from 'dummy/reducers/combined';
import all from 'dummy/reducers/all';
import users from 'dummy/reducers/users';
import roles from 'dummy/reducers/roles';
import items from 'dummy/reducers/items';
import list from 'dummy/reducers/list';
import models from 'dummy/reducers/models';
import queryParams from 'dummy/reducers/query-params';

export default combineReducers({
  low: low,
  high: high,
  combined: combined,
  all: all,
  users: users,
  roles: roles,
  models: models,
  items: items,
  list: list,
  queryParams: queryParams
});
