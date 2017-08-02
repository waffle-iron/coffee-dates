import React, { PropTypes, Component } from 'react';
import styles from './styles.css';
import SearchInput, { createFilter } from 'react-search-input';
import Highlightable from 'components/Highlightable';

const KEYS_TO_FILTERS = ['firstname', 'lastname', 'email'];

class SearchableList extends Component {
  static propTypes = {
    items: PropTypes.array,
    title: PropTypes.string,
  }
  state = {
    searchTerm: '',
  }

  searchUpdated = (term) => {
    this.setState({ searchTerm: term });
  }

  render() {
    const { items } = this.props;
    let filteredItems = [];
    if (items) {
      filteredItems = items.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));
    }
    return (
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          <div className={styles.title}>{this.props.title}</div>
          <SearchInput className={styles.searchInput} onChange={this.searchUpdated} />
        </div>
        <div className={styles.itemContainer}>
        {filteredItems.map(item => (
          <Highlightable
            key={item.objectId}
            className={styles.item}
            activeClassName={styles.itemActive}
          >
            <div className={styles.name}><span>{item.firstname} </span><span>{item.lastname}</span></div>
          </Highlightable>
        ))}
        </div>
      </div>
    );
  }
}

export default SearchableList;
