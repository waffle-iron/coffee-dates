import React, { PropTypes, Component } from 'react';
// import 'styles from' './'styles.css'';
import SearchInput, { createFilter } from 'react-search-input';
import Highlightable from 'components/Highlightable';

class SelectableList extends Component {
  static propTypes = {
    items: PropTypes.array,
    title: PropTypes.string,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    selectedIndices: PropTypes.array,
    searchKeyFilters: PropTypes.array,
  };
  static defaultProps = {
    selectedIndices: [],
    searchKeyFilters: [],
    title: 'SelectableList',
  };
  state = {
    searchTerm: '',
  }

  onComplete = () => {
    // NB: this is a little hacky and probably error prone, but it works.
    const { onSave, items } = this.props;
    const strInds = Object.keys(this.refs)
      .filter(highlightable => this.refs[highlightable].state.active);
    const inds = strInds.map(index => parseInt(index, 10));
    onSave(inds.map(ind => items[ind]));
  }

  searchUpdated = (term) => {
    this.setState({ searchTerm: term });
  }

  render() {
    const { items, selectedIndices, searchKeyFilters } = this.props;
    let filteredItems = [];
    if (items) {
      filteredItems = items.filter(createFilter(this.state.searchTerm, searchKeyFilters));
    }
    return (
      <div className={'styles.flexColumn'}>
        <div className={'styles.container'}>
          <div className={'styles.titleContainer'}>
            <div className={'styles.title'}>{this.props.title}</div>
            <SearchInput className={'styles.searchInput'} onChange={this.searchUpdated} />
          </div>
          <div className={'styles.itemContainer'}>
          {filteredItems.map((item, index) => (
            <Highlightable
              key={item.objectId}
              className={'styles.item'}
              activeClassName={'styles.itemActive'}
              ref={index}
              active={selectedIndices.includes(index)}
            >
              <div className={'styles.name'}><span>{item.firstname} </span><span>{item.lastname}</span></div>
            </Highlightable>
          ))}
          </div>
        </div>
        <div className={'styles.buttonCont'}>
          <button onClick={this.props.onCancel} className={`${'styles.flex'} ${'styles.closeBtn'}`}>Close</button>
          <button onClick={this.onComplete} className={`${'styles.flex'} ${'styles.saveBtn'}`}>Save</button>
        </div>
      </div>
    );
  }
}

export default SelectableList;
