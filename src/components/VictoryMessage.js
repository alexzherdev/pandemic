import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';


const VictoryMessage = () =>
  <div className="victory-message">
    <div className="header-container">
      <div className="shadow" />
      <div className="header">
        Victory
      </div>
    </div>
    <div className="message">
      <span>Congratulations, you saved the world!</span>
    </div>

    <Button
      onClick={() => { window.location.href = '/setup'; }}
      bsStyle="primary"
      bsSize="large">Back to Menu</Button>
  </div>;

VictoryMessage.propTypes = {
  message: PropTypes.string.isRequired
};

export default VictoryMessage;
