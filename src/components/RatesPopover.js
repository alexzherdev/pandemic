import React, { PropTypes } from 'react';
import { Label } from 'react-bootstrap';


const RatesPopover = ({ infectionRateValues, outbreaks }) =>
  <div>
    <div className="infection-rate">
      <h4 className="text-center">
        <Label bsStyle="success">Infection Rate</Label>
      </h4>
      <ul className="list-inline">
        {infectionRateValues.values.map((val, i) => {
          if (i < infectionRateValues.index) {
            return <li key={i} className="past">{val}</li>;
          } else if (i === infectionRateValues.index) {
            return <li key={i} className="current bg-success">{val}</li>;
          } else {
            return <li key={i}>{val}</li>;
          }
        })}
      </ul>
    </div>

    <div className="outbreaks">
      <h4 className="text-center">
        <Label bsStyle="danger">Outbreaks</Label>
      </h4>
      <ul className="list-inline">
        {Array(8).fill().map((val, i) =>
          <li
            key={i}
            className={i < outbreaks ? 'past' : ''}></li>
        )}
      </ul>
    </div>
  </div>;

RatesPopover.propTypes = {
  infectionRateValues: PropTypes.shape({
    index: PropTypes.number.isRequired,
    values: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
  }),
  outbreaks: PropTypes.number.isRequired
};

export default RatesPopover;
