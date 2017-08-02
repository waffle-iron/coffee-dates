import React, { PropTypes } from 'react';
// import 'styles from' './'styles.css'';

class Field extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    update: PropTypes.func,
    password: PropTypes.bool,
    onEnter: PropTypes.func.isRequired,
  };

  static defaultPropTypes = {
    label: '',
    value: '',
    update: () => ({}),
  };

  onChange = (e) => this.props.update(e.target.value);

  render() {
    const { label, value, password } = this.props;
    return (
      <div>
        <label className={'styles.label'} htmlFor={label}>{label}</label>
        <br />
        <input
          onKeyDown={this.props.onEnter}
          className={'styles.input'}
          id={label}
          value={value}
          onChange={this.onChange}
          type={password ? 'password' : 'text'}
        />
      </div>
    );
  }
}

export default Field;
