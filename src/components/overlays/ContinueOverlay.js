import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';


const ContinueOverlay = ({ message, onContinue }) =>
  <div className="overlay continue-overlay">
    <Button
      bsStyle="primary"
      onClick={onContinue}>{message}</Button>
  </div>;

ContinueOverlay.propTypes = {
  message: PropTypes.string.isRequired,
  onContinue: PropTypes.func.isRequired
};

export default ContinueOverlay;
