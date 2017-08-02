import { fromJS } from 'immutable';

export const LOGIN_REQUEST = 'loginPage/LOGIN_REQUEST';
export const loginRequest = (username, password) => ({
  type: LOGIN_REQUEST,
  username,
  password,
});

export const LOGIN_SUCCESS = 'loginPage/LOGIN_SUCCESS';
export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  user,
});

export const LOGIN_ERROR = 'loginPage/LOGIN_ERROR';
export const loginError = (error) => ({
  type: LOGIN_ERROR,
  error,
});

const initialState = fromJS({
  fetching: false,
  error: null,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return state
        .set('fetching', true)
        .set('error', null);
    case LOGIN_SUCCESS:
      return state
        .set('fetching', false)
        .set('error', null);
    case LOGIN_ERROR:
      return state
        .set('fetching', false)
        .set('error', action.error);
    default:
      return state;
  }
};
