import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { LOGIN_REQUEST, loginSuccess, loginError } from './reducer';
import { updateUser } from 'containers/App/reducer';
import { fetchLogin } from 'api';
import { push } from 'react-router-redux';

function* loginAttempt(action) {
  try {
    const { username, password } = action;
    const user = yield call(fetchLogin, username, password);
    yield put(updateUser(user));
    yield put(push('/rush'));
    yield put(loginSuccess(user));
  } catch (e) {
    yield put(loginError(e.message));
  }
}

export function* login() {
  yield* takeLatest(LOGIN_REQUEST, loginAttempt);
}

export default [
  login,
];
