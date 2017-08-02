import React, { PropTypes, Component } from 'react';
// import 'styles from' '../../'styles.css'';

class Radio extends Component {
  static propTypes = {
    id: PropTypes.number,
    q: PropTypes.string,
    outOf: PropTypes.number,
    brief: PropTypes.string,
    onChange: PropTypes.func,
  };
  static defaultProps = {
    // eslint-disable-next-line no-console
    onChange: selected => console.log(selected),
  };
  state = {
    selected: null,
  }
  onChange = (e) => {
    const selected = parseInt(e.currentTarget.value, 10);
    this.setState({
      selected,
    });
    this.props.onChange(this.props.brief, selected);
  }
  render() {
    return (
      <div>
        <div className={'styles.question'}>{this.props.q}</div>
        <div className={'styles.inputCont'}>
          {Array(this.props.outOf).fill().map((_, i) => {
            const id = `${this.props.brief}${i + 1}`;
            const value = i + 1;
            return (
              <div key={i} className={'styles.flexCenter'}>
                <span>
                  <input
                    className={'styles.input'}
                    id={id}
                    type="radio"
                    name={this.props.brief}
                    value={value}
                    checked={this.state.selected === value}
                    onChange={this.onChange}
                  />
                  <label htmlFor={id}><span></span>{value}</label>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Radio;
