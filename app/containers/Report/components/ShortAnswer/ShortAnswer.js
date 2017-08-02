import React, { PropTypes, Component } from 'react';
// import 'styles from' '../../'styles.css'';

class ShortAnswer extends Component {
  static propTypes = {
    q: PropTypes.string.isRequired,
    brief: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  };
  state = {
    value: '',
  }

  onChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
    this.props.onChange(this.props.brief, value);
  }

  render() {
    return (
      <div>
        <div className={'styles.question'}>{this.props.q}</div>
        <input
          type="text"
          value={this.state.value}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default ShortAnswer;
