import Ember from 'ember';
import saga from 'npm:redux-saga';
import effects from 'npm:redux-saga/effects';

const { takeEvery } = saga;
const { call, put } = effects;

const delay = ms => Ember.run.next(resolve => setTimeout(resolve, ms));

function* incrementAsync() {
  yield call(delay, 0);
  yield put({type: 'UP'});
}

export default function* addAsync() {
  yield takeEvery('ADD', incrementAsync);
}
