import React, { PropTypes } from 'react';
// import 'styles from' './'styles.css'';

const Button = ({ text, onClick }) => (
  <button className={'styles.container'} onClick={onClick}>
    {text}
  </button>
);
Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Button;
