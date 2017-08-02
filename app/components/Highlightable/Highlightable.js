import React, { PropTypes, Component } from 'react';

class Highlightable extends Component {
  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    activeClassName: PropTypes.string,
    active: PropTypes.bool,
  };
  static defaultProps = {
    active: false,
  };
  state = {
    active: this.props.active,
  }

  toggleActive = () => {
    this.setState({ active: !this.state.active });
  }

  render() {
    const { children, className, activeClassName } = this.props;
    return (
      <div
        className={this.state.active ? activeClassName : className}
        onClick={this.toggleActive}
      >
        {children}
      </div>
    );
  }
}

export default Highlightable;
