import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import {
  UPDATE_FIELD_REQUEST,
  updateFieldError,
  updateFieldSuccess,
} from '../App/reducer';
import {
  FETCH_MEMBER_REQUEST,
  FETCH_RUSHEES_REQUEST,
  fetchMemberSuccess,
  fetchMemberError,
  fetchRusheesSuccess,
  fetchRusheesError,
} from './reducer';
import {
  fetchMember,
  fetchRushees,
  pushField,
} from '../../api';
// import { push } from 'react-router-redux';

function* fetchMemberAttempt(action) {
  try {
    const member = yield call(fetchMember, action.lastname);
    yield put(updateFieldSuccess('id', member.id));
    yield put(updateFieldSuccess('capacity', member.get('capacity')));
    yield put(updateFieldSuccess('friends', member.get('friends')));
    yield put(updateFieldSuccess('pending_rushees', member.get('pending_rushees')));
    yield put(updateFieldSuccess('completed_cds', member.get('completed_cds')));
    yield put(updateFieldSuccess('firstname', member.get('firstname')));
    yield put(updateFieldSuccess('lastname', member.get('lastname')));
    yield put(updateFieldSuccess('email', member.get('email')));
    yield put(fetchMemberSuccess());
  } catch (e) {
    yield put(fetchMemberError(e.message));
  }
}

function* fetchRusheesAttempt(action) {
  try {
    const rushees = yield call(fetchRushees, action.lastname);
    yield put(fetchRusheesSuccess(rushees));
  } catch (e) {
    yield put(fetchRusheesError(e.message));
  }
}

function* updateFieldAttempt(field) {
  try {
    const memberId = yield select(state => state.get('global').get('id'));
    const newField = yield call(pushField, field.key, field.value, memberId);
    yield put(updateFieldSuccess(field.key, newField));
  } catch (e) {
    yield put(updateFieldError(e.message));
  }
}

export function* manageMember() {
  yield* takeLatest(FETCH_MEMBER_REQUEST, fetchMemberAttempt);
}

export function* manageRushees() {
  yield* takeLatest(FETCH_RUSHEES_REQUEST, fetchRusheesAttempt);
}

export function* manageMemberFields() {
  yield* takeLatest(UPDATE_FIELD_REQUEST, updateFieldAttempt);
}

export default [
  manageMember,
  manageRushees,
  manageMemberFields,
];
