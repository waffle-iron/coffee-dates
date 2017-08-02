import React, { PropTypes, Component } from 'react';
// import 'styles from' '../../'styles.css'';
import { updateRushee } from 'containers/Report/reducer';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

class Item extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    person: PropTypes.shape({
      id: PropTypes.string,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      email: PropTypes.string,
    }),
  };

  state = {
    open: false,
  }

  onClick = () => {
    this.setState({ open: !this.state.open });
    this.props.onClick();
  }

  writeReport = () => {
    this.props.dispatch(updateRushee(this.props.person));
    this.props.dispatch(push('/rush/report'));
  }

  render() {
    const { person } = this.props;
    return (
      <div className={'styles.itemContainer'}>
        <div className={'styles.item'} onClick={this.onClick}>
          <div className={'styles.flex'}>
            <div className={`${'styles.copy'} ${'styles.lefted'}`}>{person.firstname} {person.lastname}</div>
            <div className={`${'styles.copy'} ${'styles.righted'}`}>{person.email}</div>
          </div>
        </div>
        <div className={`${'styles.closed'} ${this.state.open ? 'styles.open' : ''}`}>
          <div className={'styles.details'}>
            <a
              className={`${'styles.detailsContainer'} ${'styles.email'}`}
              href={`mailto:${person.email}`}
            >
              Email this rushee
            </a>
            <div
              className={`${'styles.detailsContainer'} ${'styles.report'}`}
              onClick={this.writeReport}
            >
              Write report
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(() => ({}))(Item);
