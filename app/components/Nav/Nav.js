import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
// import 'styles from' './'styles.css'';
import Img from 'components/Img';

const Nav = ({ onLogoHandler, onLogoutHandler }) => (
  <div className={'styles.container'}>
    <div className={'styles.content'}>
      <Img
        className={'styles.logo'}
        name="whiteA"
        onClick={onLogoHandler}
      />
      <div className={'styles.logout'} onClick={onLogoutHandler}>
        <FormattedMessage {...messages.logout} />
      </div>
    </div>
  </div>
);
Nav.propTypes = {
  onLogoHandler: PropTypes.func.isRequired,
  onLogoutHandler: PropTypes.func.isRequired,
};

export default Nav;
