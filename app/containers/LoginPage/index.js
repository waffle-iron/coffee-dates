/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { PropTypes, Component } from 'react';
// import styles from './styles.css';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import Form from 'components/Form';

import { connect } from 'react-redux';
import { loginRequest } from './reducer';
import { selectLoginPage } from './selectors';

class LoginPage extends Component {
  static propTypes = {
    fetching: PropTypes.bool.isRequired,
    error: PropTypes.any,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(form) {
    this.props.dispatch(loginRequest(form.USERNAME.text, form.PASSWORD.text));
  }

  render() {
    return (
      <div>
        <h1 className={'styles.header'}>
          <FormattedMessage {...messages.header} />
        </h1>
        <div>
          {this.props.fetching ? (
            <div className={'styles.spinner'}>
              <div className={'styles.loader'}>Loading...</div>
            </div>
          ) : (
            <Form
              type="login"
              onSubmit={this.onLogin}
              submitMsg="Login"
            />
          )}
          {this.props.error && (
            <div className={'styles.errorContainer'}>
              <p className={'styles.error'}>{this.props.error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(selectLoginPage)(LoginPage);
