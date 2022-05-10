import React from "react";
import ReactDOM from "react-dom";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  width: "40%",
  padding: "40px 40px 20px 40px",
  zIndex: 100,
  borderRadius: "5px",
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,.7)",
  zIndex: 100,
};

const BTN_STYLES1 = {
  padding: "12px 20px",
};
const BTN_STYLES2 = {
  backgroundColor: "#6C757D",
  borderColor: "#6C757D",
  marginRight: "0.25rem",
  color: "#fff",
  padding: "12px 20px",
};

const FOOTER = {
  display: "flex",
  justifyContent: "flex-end",
};

const Modal = ({ children, open, onClose, submit, post }) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <>
      <div style={OVERLAY_STYLES}></div>
      <div style={MODAL_STYLES}>
        {children}
        <div style={FOOTER}>
          <button
            onClick={onClose}
            style={BTN_STYLES2}
            className="btn btn-success"
          >
            Exit
          </button>
          {submit && (
            <button
              onClick={post}
              style={BTN_STYLES1}
              className="btn btn-success"
            >
              {submit}
            </button>
          )}
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
};

export default Modal;
