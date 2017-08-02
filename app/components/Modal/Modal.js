import React, { PropTypes } from 'react';
// import 'styles from' './'styles.css'';
import ReactModal from 'react-modal';

const Modal = (props) => (
  <ReactModal
    isOpen={props.open}
    overlayClassName={'styles.overlay'}
    className={'styles.backdrop'}
    onAfterOpen={props.onOpen}
    onRequestClose={props.onClose}
  >
    <div className={'styles.container'}>
      {props.children}
    </div>
  </ReactModal>
);
Modal.propTypes = {
  children: PropTypes.any,
  open: PropTypes.bool.isRequired,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};

export default Modal;
