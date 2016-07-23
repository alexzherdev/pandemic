import React, { PropTypes } from 'react';
import { Label } from 'react-bootstrap';
import classnames from 'classnames';


export default class RatesPopover extends React.Component {
  static propTypes = {
    infectionRateValues: PropTypes.shape({
      index: PropTypes.number.isRequired,
      values: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
      }),
    outbreaks: PropTypes.number.isRequired,
    showNewOutbreaks: PropTypes.bool.isRequired,
    showNewInfectionRate: PropTypes.bool.isRequired,
    onAnimationEnd: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.setFlashListener();
  }

  componentDidUpdate() {
    this.setFlashListener();
  }

  setFlashListener() {
    if (this.flashingEl) {
      this.flashingEl.addEventListener('animationend', () =>
        this.props.onAnimationEnd()
      );
    }
  }

  render() {
    const { infectionRateValues, outbreaks, showNewInfectionRate, showNewOutbreaks } = this.props;
    return (
      <div>
        <div className="infection-rate">
          <h4 className="text-center">
            <Label bsStyle="success">Infection Rate</Label>
          </h4>
          <ul className="list-inline">
            {infectionRateValues.values.map((val, i) => {
              if (i < infectionRateValues.index) {
                return (
                  <li
                    key={i}
                    className="past">{val}</li>
                );
              } else if (i === infectionRateValues.index) {
                return (
                  <li
                    ref={(el) => { if (showNewInfectionRate) { this.flashingEl = el; } }}
                    key={i}
                    className={classnames(['current', 'bg-success', { 'animated flash': showNewInfectionRate }])}>{val}</li>
                );
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
            {Array(8).fill().map((val, i) => {
              if (i < outbreaks - 1) {
                return (
                  <li
                    key={i}
                    className="past" />
                );
              } else if (i === outbreaks - 1) {
                return (
                  <li
                    ref={(el) => { if (showNewOutbreaks) { this.flashingEl = el; } }}
                    key={i}
                    className={classnames(['past', { 'animated flash': showNewOutbreaks }])} />
                );
              } else {
                return <li key={i} />;
              }
            })}
          </ul>
        </div>
      </div>
    );
  }
}
