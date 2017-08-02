import React, { PropTypes, Component } from 'react';
// import 'styles from' '../../'styles.css'';

class LongAnswer extends Component {
  static propTypes = {
    q: PropTypes.string.isRequired,
    brief: PropTypes.string.isRequired,
    onChange: PropTypes.func,
  };
  static defaultProps = {
    // eslint-disable-next-line no-console
    onChange: () => console.log('Please pass in an onChange prop.'),
  }
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
      <div className={'styles.container'}>
        <div className={'styles.question'}>
          {this.props.q}
        </div>
        <textarea
          className={'styles.longAnswer'}
          value={this.state.value}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default LongAnswer;
