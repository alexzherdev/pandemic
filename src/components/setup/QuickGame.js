import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { partial } from 'lodash';


const QuickGame = ({ onNumberOfPlayersPicked }) => {
  return (
    <div className="quick-game">
      <h4>
        Choose the number of players:
      </h4>
      <div>
        {[1, 2, 3, 4, 5].map((n) =>
          <Button
            key={n}
            onClick={partial(onNumberOfPlayersPicked, n)}>{n}</Button>
        )}
      </div>
    </div>
  );
};

QuickGame.propTypes = {
  onNumberOfPlayersPicked: PropTypes.func.isRequired
};

export default QuickGame;
