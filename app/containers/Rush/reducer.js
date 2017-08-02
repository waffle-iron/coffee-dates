import { fromJS } from 'immutable';

export const FETCH_MEMBER_REQUEST = 'rush/FETCH_MEMBER_REQUEST';
export const fetchMemberRequest = (lastname) => ({
  type: FETCH_MEMBER_REQUEST,
  lastname,
});

export const FETCH_MEMBER_SUCCESS = 'rush/FETCH_MEMBER_SUCCESS';
export const fetchMemberSuccess = () => ({
  type: FETCH_MEMBER_SUCCESS,
});

export const FETCH_MEMBER_ERROR = 'rush/FETCH_MEMBER_ERROR';
export const fetchMemberError = (error) => ({
  type: FETCH_MEMBER_ERROR,
  error,
});

export const FETCH_RUSHEES_REQUEST = 'rush/FETCH_RUSHEES_REQUEST';
export const fetchRusheesRequest = () => ({
  type: FETCH_RUSHEES_REQUEST,
});

export const FETCH_RUSHEES_ERROR = 'rush/FETCH_RUSHEES_ERROR';
export const fetchRusheesError = (error) => ({
  type: FETCH_RUSHEES_ERROR,
  error,
});

export const FETCH_RUSHEES_SUCCESS = 'rush/FETCH_RUSHEES_SUCCESS';
export const fetchRusheesSuccess = (rushees) => ({
  type: FETCH_RUSHEES_SUCCESS,
  rushees,
});

const initialState = fromJS({
  member: null,
  rushees: null,
  error: null,
  fetching: false,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MEMBER_REQUEST:
    case FETCH_RUSHEES_REQUEST:
      return state.set('fetching', true)
        .set('error', false);

    case FETCH_MEMBER_ERROR:
    case FETCH_RUSHEES_ERROR:
      return state.set('error', action.error)
        .set('fetching', false);

    case FETCH_MEMBER_SUCCESS:
      return state.set('fetching', false)
        .set('error', false);
    case FETCH_RUSHEES_SUCCESS:
      return state.set('rushees', action.rushees)
        .set('fetching', false)
        .set('error', false);

    default:
      return state;
  }
};
