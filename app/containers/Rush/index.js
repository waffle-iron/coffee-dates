import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import 'styles from' './'styles.css'';

import ItemList from 'components/ItemList';
import Container from 'components/Container';
import Img from 'components/Img';
import DisplayNames from 'components/DisplayNames';
import Modal from 'components/Modal';
import SelectableList from 'components/SelectableList';

import { push } from 'react-router-redux';
import {
  fetchMemberRequest,
  fetchRusheesRequest,
} from './reducer';
import { updateFieldRequest } from '../App/reducer';

/**
 * Utility function to confirm that all values are full
**/
const allMemberValues = (globalReducer) => {
  if (!(typeof globalReducer === 'object')) return false;
  let valid = true;
  Object.keys(globalReducer).forEach(key => {
    if (!globalReducer[key]) valid = false;
  });
  return valid;
};

export class RushHome extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    capacity: PropTypes.number,
    pendingRushees: PropTypes.array,
    friends: PropTypes.array,
    completedCds: PropTypes.array,
    rushees: PropTypes.array,
    fetching: PropTypes.bool,
  }
  state = {
    modalOpen: false,
  }
  componentWillMount() {
    if (!this.props.currentUser) {
      this.props.dispatch(push('/login'));
    } else if (!this.props.rushees && !allMemberValues(this.props) && !this.props.fetching) {
      const username = this.props.currentUser.get('username');
      this.props.dispatch(fetchMemberRequest(username));
      this.props.dispatch(fetchRusheesRequest());
    }
  }

  onCapacityLess = () => {
    this.props.dispatch(updateFieldRequest('capacity', this.props.capacity - 1));
  }

  onCapacityMore = () => {
    this.props.dispatch(updateFieldRequest('capacity', this.props.capacity + 1));
  }

  onSaveSelected = (selected) => {
    // TODO: Saga logic with backend.
    const flatSelected = selected.map(e => ({
      email: e.email,
      firstname: e.firstname,
      lastname: e.lastname,
      objectId: e.objectId,
    }));
    this.props.dispatch(updateFieldRequest('friends', flatSelected));
    this.closeModal();
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  }

  render() {
    // double check, so that we don't render half the page
    if (!this.props.currentUser) {
      return null;
    }
    const rushees = this.props.rushees || [];
    const friends = this.props.friends || [];
    const friendRusheeIndices = [];
    // TODO: not tested, as I don't have a member with friends yet.
    rushees.forEach((r, index) => {
      if (this.props.friends.map(friend => friend.objectId).includes(r.id)) {
        friendRusheeIndices.push(index);
      }
    });
    const modalComponent = (
      <SelectableList
        title="Rushees"
        selectedIndices={friendRusheeIndices}
        searchKeyFilters={['firstname', 'lastname', 'email']}
        items={rushees.map(r => r.toJSON())}
        onCancel={this.closeModal}
        onSave={this.onSaveSelected}
      />
    );
    return (
      <div className={'styles.page'}>
        <Helmet
          title="Member"
          meta={[
            { name: 'description', content: 'Member panel' },
          ]}
        />
      {/* Dates */}
        <div className={'styles.flexHalf'}>
          <ItemList
            people={this.props.pendingRushees}
            title="Current Dates"
          />
        </div>
      {/* Capacity */}
        <div className={'styles.flexHalf'}>
          <h1 className={'styles.header'}>
            Capacity
          </h1>
          <Container className={'styles.capCont'}>
            <div className={'styles.flexCenter'}>
              <Img className={'styles.minus'} name="darkRedMinus" onClick={this.onCapacityLess} />
            </div>
            <div className={'styles.capacityCount'}>{this.props.capacity}</div>
            <div className={'styles.flexCenter'}>
              <Img className={'styles.plus'} name="darkRedPlus" onClick={this.onCapacityMore} />
            </div>
          </Container>
      {/* Friends */}
          <DisplayNames
            title="Friends"
            emptyMessage="You have no friends yet."
            names={friends.map(f => `${f.firstname} ${f.lastname}`)}
            onAdd={this.openModal}
          />
      {/* Completed Dates */}
          <DisplayNames
            title="Completed Dates"
            emptyMessage="You have not dated anyone yet."
            names={this.props.completedCds ? this.props.completedCds.map(date => `${date.firstname} ${date.lastname}`) : null}
          />
        </div>
        <Modal open={this.state.modalOpen}>
          {modalComponent}
        </Modal>
      </div>
    );
  }
}


export default connect(state => {
  const globalData = state.get('global');
  const data = state.get('rush');
  return {
    fetching: data.get('fetching'),
    currentUser: globalData ? globalData.get('user') : null,
    capacity: globalData ? globalData.get('capacity') : null,
    pendingRushees: globalData ? globalData.get('pending_rushees') : null,
    completedCds: globalData ? globalData.get('completed_cds') : null,
    friends: globalData ? globalData.get('friends') : null,
    rushees: data ? data.get('rushees') : null,
  };
})(RushHome);
