import redux from 'npm:redux';
const { combineReducers } = redux;

import low from 'dummy/reducers/low';
import high from 'dummy/reducers/high';
import all from 'dummy/reducers/all';
import users from 'dummy/reducers/users';
import roles from 'dummy/reducers/roles';
import items from 'dummy/reducers/items';
import models from 'dummy/reducers/models';

export default combineReducers({
    low,
    high,
    all,
    users,
    roles,
    models,
    items
});
