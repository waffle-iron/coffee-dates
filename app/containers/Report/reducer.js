import { fromJS } from 'immutable';
import defaultQs from './qs';

export const UPDATE_REPORT = 'report/UPDATE_REPORT';
export const updateReport = (report) => ({
  type: UPDATE_REPORT,
  report,
});

export const UPDATE_RUSHEE = 'UPDATE_RUSHEE';
export const updateRushee = (rushee) => ({
  type: UPDATE_RUSHEE,
  rushee,
});

export const ANSWER_FIELD = 'report/ANSWER_FIELD';
export const answerField = (pageNo, brief, value) => ({
  type: ANSWER_FIELD,
  pageNo,
  brief,
  value,
});

export const PUSH_REPORT_REQUEST = 'report/PUSH_REPORT_REQUEST';
export const pushReportRequest = (report) => ({
  type: PUSH_REPORT_REQUEST,
  report,
});

export const PUSH_REPORT_SUCCESS = 'report/PUSH_REPORT_SUCCESS';
export const pushReportSuccess = (report) => ({
  type: PUSH_REPORT_SUCCESS,
  report,
});

export const PUSH_REPORT_ERROR = 'report/PUSH_REPORT_ERROR';
export const pushReportError = (error) => ({
  type: PUSH_REPORT_ERROR,
  error,
});

const qsToAnswerFormat = (qs) => {
  const as = {};
  qs.forEach((page, index) => {
    as[index] = {};
    page.fields.forEach(obj => {
      as[index][obj.brief] = null;
    });
  });
  return as;
};

const initialState = fromJS({
  rushee: null,
  pages: qsToAnswerFormat(defaultQs),
  fetching: false,
  error: null,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case PUSH_REPORT_REQUEST:
      return state.set('error', null)
        .set('fetching', true);
    case PUSH_REPORT_ERROR:
      return state.set('fetching', false)
        .set('error', action.error);
    case PUSH_REPORT_SUCCESS:
      return state.set('error', null)
        .set('fetching', false);

    case ANSWER_FIELD:
      return state.setIn(['pages', action.pageNo, action.brief], action.value);
    case UPDATE_RUSHEE:
      return state.set('rushee', action.rushee);
    default:
      return state;
  }
};
