import React, { PropTypes } from 'react';
// import 'styles from' './'styles.css'';

import Container from 'components/Container';
import Img from 'components/Img';

const DisplayNames = (props) => (
  <div className={'styles.container'}>
    <h1 className={'styles.header'}>
      {props.title}
    </h1>
    <Container>
      <ul className={'styles.friendsList'}>
        {(props.names && props.names.length > 0) ? props.names.map((name, index) => (
          <li key={index}>{name}</li>
        )) : <li>{props.emptyMessage}</li>}
      </ul>
      <div className={'styles.rightImgCont'}>
        {props.onAdd && <Img
          className={'styles.plus'}
          name="darkRedPlus"
          onClick={props.onAdd}
        />}
      </div>
    </Container>
  </div>
  );
DisplayNames.propTypes = {
  title: PropTypes.string,
  emptyMessage: PropTypes.string,
  names: PropTypes.arrayOf(PropTypes.string),
  onAdd: PropTypes.func,
};
DisplayNames.defaultProps = {
  title: 'Display Names',
  emptyMessage: 'This display is empty.',
  onAdd: null,
};

export default DisplayNames;
