import React, { PropTypes } from 'react';
import Item from './components/Item';
// import 'styles from' './'styles.css'';

const ItemList = ({ people, title, onItemClick }) => (
  <div className={'styles.container'} >
    <h1 className={'styles.header'}>{title && title}</h1>
    {people && people.map((person, key) => {
      const onClick = () => {
        onItemClick({ ...person, key });
      };
      return (
        <Item
          key={key}
          person={person}
          onClick={onClick}
        />
      );
    })}
  </div>
);
ItemList.propTypes = {
  onItemClick: PropTypes.func,
  people: PropTypes.arrayOf(PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
  })),
  title: PropTypes.string,
};
ItemList.defaultProps = {
  onItemClick: () => null,
};

export default ItemList;
