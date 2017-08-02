import React, { PropTypes } from 'react';
// import 'styles from' './'styles.css'';

class Button extends React.Component {
  static propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    active: PropTypes.bool,
    className: PropTypes.string,
  };
  static defaultProps = {
    active: true,
  };
  state = {}

  render() {
    const { text, onClick, active, className } = this.props;
    return (
      <button
        className={`${active ? 'styles.button' : 'styles.buttonInactive'} ${className}`}
        onClick={active ? onClick : null}
      >
        {text}
      </button>
    );
  }
}

export default Button;
