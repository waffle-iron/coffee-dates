import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import {
  PUSH_REPORT_REQUEST,
  pushReportError,
  pushReportSuccess,
} from './reducer';
import { updateFieldSuccess } from '../App/reducer';
import { pushReport, removeRushee } from '../../api';

const selectMember = state => {
  const glob = state.get('global');
  return {
    objectId: glob.get('id'), // need the id to associate in backend;
    pending_rushees: glob.get('pending_rushees'), // need to remove rushee
    completed_cds: glob.get('completed_cds'),
    firstname: glob.get('firstname'),
    lastname: glob.get('lastname'),
    email: glob.get('lastname'),
  };
};

// NB: This is a little hacky; because the info that is encapuslated by
//     the 'pending_rushees' field does not include the ID (stupid decision
//     made in the legacy app), we need to find the relevant rushee object
//     in the list of all rushees, rather than just directly using the object
//     contained in the pending_rushees array. pending_rushees should really
//     also be a relation, rather than an array.
const selectRushee = state => {
  const allRushees = state.getIn(['rush', 'rushees']);
  const rushee = state.getIn(['report', 'rushee']);
  // will just return the first value if there are duplicates
  const ourOneRushee = allRushees.filter(r => r.get('email') === rushee.email)[0];
  return {
    objectId: ourOneRushee.id,
    pending_member: ourOneRushee.get('pending_member'),
    second_pending_member: ourOneRushee.get('second_pending_member'),
    completed_cds: ourOneRushee.get('completed_cds'),
    firstname: ourOneRushee.get('firstname'),
    lastname: ourOneRushee.get('lastname'),
    email: ourOneRushee.get('email'),
  };
};

function* pushReportAttempt(action) {
  try {
    const rushee = yield select(selectRushee);
    const member = yield select(selectMember);
    const newReport = yield call(pushReport, action.report, rushee, member);
    const newMember = yield call(removeRushee, rushee, member);
    yield put(updateFieldSuccess('pending_rushees', newMember.get('pending_rushees')));
    yield put(updateFieldSuccess('completed_cds', newMember.get('completed_cds')));
    yield put(push('/rush'));
    yield put(pushReportSuccess(newReport));
  } catch (e) {
    yield put(pushReportError(e.message));
  }
}

export function* manageReport() {
  yield* takeLatest(PUSH_REPORT_REQUEST, pushReportAttempt);
}


export default [
  manageReport,
];
