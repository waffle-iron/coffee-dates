import { createSelector } from 'reselect';

// import { fromJS } from 'immutable';
// const egState = fromJS({
//   loginPage: {
//     fetching: false,
//     error: 'Some error',
//   },
// });

/**
 * Direct selector to the loginPage state domain
 */
const selectLoginDomain = () => state => state.get('loginPage');

const selectLoginFetching = createSelector(
  selectLoginDomain(),
  (loginPage) => loginPage.get('fetching')
);

const selectLoginError = createSelector(
  selectLoginDomain(),
  (loginPage) => loginPage.get('error')
);

const selectLoginPage = createSelector(
  selectLoginFetching,
  selectLoginError,
  (fetching, error) => ({
    fetching,
    error,
  })
);

export {
  selectLoginFetching,
  selectLoginError,
  selectLoginPage,
};
