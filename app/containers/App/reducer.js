import { fromJS } from 'immutable';

export const UPDATE_USER = 'global/UPDATE_USER';
export const updateUser = (user) => ({
  type: UPDATE_USER,
  user,
});

export const UPDATE_FIELD_REQUEST = 'global/UPDATE_FIELD_REQUEST';
export const updateFieldRequest = (key, value) => ({
  type: UPDATE_FIELD_REQUEST,
  key,
  value,
});

export const UPDATE_FIELD_ERROR = 'global/UPDATE_FIELD_ERROR';
export const updateFieldError = (error) => ({
  type: UPDATE_FIELD_ERROR,
  error,
});

export const UPDATE_FIELD_SUCCESS = 'global/UPDATE_FIELD_SUCCESS';
export const updateFieldSuccess = (key, value) => ({
  type: UPDATE_FIELD_SUCCESS,
  key,
  value,
});

const initialState = fromJS({
  user: null,
  /* member fields */
  id: null,
  capacity: null,
  friends: null,
  completed_cds: null,
  pending_rushees: null,
  firstname: null,
  lastname: null,
  email: null,
  /* state fields */
  fetching: false,
  error: null,
});

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return state.set('user', action.user);

    case UPDATE_FIELD_REQUEST:
      return state.set('error', null)
        .set('fetching', true);

    case UPDATE_FIELD_ERROR:
      return state.set('fetching', false)
        .set('error', action.error);

    case UPDATE_FIELD_SUCCESS: {
      // console.log(`key: ${action.key}, value: ${action.value}`);
      const jsState = Object.keys(state.toJS());
      if (jsState && jsState.includes(action.key)) {
        return state.set('fetching', false)
          .set('error', null)
          .set(action.key, action.value);
      }
      return state;
    }

    default:
      return state;
  }
};
