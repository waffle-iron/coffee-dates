import React, { PropTypes } from 'react';
// import 'styles from' './'styles.css'';

const Container = (props) => (
  <div className={`${'styles.body'} ${props.className}`}>
    {props.children}
  </div>
);
Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
};

export default Container;
