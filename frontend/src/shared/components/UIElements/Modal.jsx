import React, { useRef } from "react";
import ReactDOM from "react-dom";
import Backdrop from "./Backdrop";
import { CSSTransition } from "react-transition-group";
import "./Modal.css";

const Modal = (props) => {
  const nodeRef = useRef(null); // Create a reference for the component

  const ModalOverlay = (props) => {
    const content = (
      <div
        ref={nodeRef} // Attach ref here
        className={`modal ${props.className}`}
        style={props.style}
      >
        <header className={`modal__header ${props.headerClass}`}>
          <h2>{props.header}</h2>
        </header>
        <form
          onSubmit={
            props.onSubmit ? props.onSubmit : (event) => event.preventDefault()
          }
        >
          <div className={`modal__content ${props.contentClass}`}>
            {props.children}
          </div>
          <footer className={`modal__footer ${props.footerClass}`}>
            {props.footer}
          </footer>
        </form>
      </div>
    );
    return ReactDOM.createPortal(
      content,
      document.getElementById("modal-hook")
    );
  };

  return (
    <React.Fragment>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        timeout={200}
        classNames="modal"
        mountOnEnter
        unmountOnExit
        nodeRef={nodeRef} // Attach ref here
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
