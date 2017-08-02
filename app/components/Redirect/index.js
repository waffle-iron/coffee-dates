import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

const DEFAULT_URL = '/login';

class Redirect extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    route: PropTypes.object,
    params: PropTypes.object,
  };
  componentWillMount() {
    const route = this.props.route.redirectPath || this.props.params.route || DEFAULT_URL;
    this.props.dispatch(push(route));
  }

  render() {
    return null;
  }
}

export default connect()(Redirect);
