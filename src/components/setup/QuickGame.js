import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { partial } from 'lodash';


const QuickGame = ({ onNumberOfPlayersPicked, onBackClicked }) => {
  return (
    <div className="quick-game">
      <h2>
        Quick Start
      </h2>
      <h5>Play a game of standard difficulty with roles chosen at random.</h5>
      <h4>
        Choose the number of players:
      </h4>
      <div className="number-container">
        {[1, 2, 3, 4, 5].map((n) =>
          <Button
            key={n}
            bsSize="large"
            onClick={partial(onNumberOfPlayersPicked, n)}>{n}</Button>
        )}
      </div>
      <Button
        bsStyle="link"
        onClick={onBackClicked}>Back</Button>
    </div>
  );
};

QuickGame.propTypes = {
  onNumberOfPlayersPicked: PropTypes.func.isRequired,
  onBackClicked: PropTypes.func.isRequired
};

export default QuickGame;
