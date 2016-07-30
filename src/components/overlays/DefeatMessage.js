import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';


const DefeatMessage = ({ message }) =>
  <div className="overlay defeat-message">
    <div className="header-container">
      <div className="shadow" />
      <div className="header">
        Defeat
      </div>
    </div>
    <div className="message">
      <span>{message}</span>
    </div>

    <Button
      onClick={() => { window.location.href = '/'; }}
      bsStyle="primary"
      bsSize="large">Back to Menu</Button>
  </div>;

DefeatMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default DefeatMessage;
