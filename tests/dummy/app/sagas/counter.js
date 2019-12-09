import { next } from '@ember/runloop';
import { takeEvery, put, call } from 'redux-saga/effects';

const delay = ms => next(resolve => setTimeout(resolve, ms));

function* incrementAsync() {
  yield call(delay, 0);
  yield put({type: 'UP'});
}

export default function* addAsync() {
  yield takeEvery('ADD', incrementAsync);
}
