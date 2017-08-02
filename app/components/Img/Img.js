import React, { PropTypes, Component } from 'react';
// import 'styles from' './'styles.css'';
import pics from './pics';

class Img extends Component {
  state = {
    image: pics[this.props.name].base,
  }
  onMouseOver = () => {
    this.setState({
      image: pics[this.props.name].hover,
    });
  }
  onMouseOut = () => {
    this.setState({
      image: pics[this.props.name].base,
    });
  };
  render() {
    return (
      <img
        className={`${'styles.image'} ${this.props.className}`}
        onClick={this.props.onClick}
        onMouseOver={this.onMouseOver}
        onFocus={this.onMouseOver}
        onBlur={this.onMouseOut}
        onMouseOut={this.onMouseOut}
        alt={this.props.name}
        src={this.state.image}
      />
    );
  }
}
Img.defaultProps = {
  onClick: () => ({}),
  name: 'blackPlus',
};
Img.propTypes = {
  name: PropTypes.oneOf(Object.keys(pics)),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Img;
