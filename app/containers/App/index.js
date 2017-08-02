/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Nav from 'components/Nav';
// import styles from './styles.css';

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object,
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.onLogoHandler = this.onLogoHandler.bind(this);
    this.onLogoutHandler = this.onLogoutHandler.bind(this);
  }

  onLogoHandler() {
    this.props.dispatch(push('/rush'));
  }

  onLogoutHandler() {
    this.props.dispatch(push('/login'));
  }

  render() {
    // !this.props.location.pathname.match(/(\/$)|(\/login)$/)
    return (
      <div className={'styles.container'}>
        {!this.props.location.pathname.match(/\/login$/) && (
          <Nav
            onLogoHandler={this.onLogoHandler}
            onLogoutHandler={this.onLogoutHandler}
          />
        )}
        {React.Children.toArray(this.props.children)}
      </div>
    );
  }
}

export default connect(() => ({}))(App);
