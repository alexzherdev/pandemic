import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { OverlayTrigger, Panel, Popover } from 'react-bootstrap';
import { partial } from 'lodash';
import classnames from 'classnames';

import RatesPopover from '../components/RatesPopover';
import { getPlayerDeckCount, getInfectionRate, getInfectionRateValues, getDiseaseStatus } from '../selectors';
import DISEASES from '../constants/diseases';
import { continueTurn } from '../actions/globalActions';


class TopBar extends React.Component {
  static propTypes = {
    cubesLeft: PropTypes.objectOf(PropTypes.number.isRequired).isRequired,
    stationsLeft: PropTypes.number.isRequired,
    playerDeckCount: PropTypes.number.isRequired,
    infectionRate: PropTypes.number.isRequired,
    infectionRateValues: PropTypes.shape({
      index: PropTypes.number.isRequired,
      values: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
    }),
    outbreaks: PropTypes.number.isRequired,
    getDiseaseStatus: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onPopoverAnimationEnd = this.onPopoverAnimationEnd.bind(this);
  }

  state = {
    showNewInfectionRate: false,
    showNewOutbreaks: false
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ showNewInfectionRate: nextProps.infectionRateValues.index !== this.props.infectionRateValues.index,
      showNewOutbreaks: nextProps.outbreaks !== this.props.outbreaks });
  }

  componentDidUpdate() {
    if (this.state.showNewInfectionRate || this.state.showNewOutbreaks) {
      this.refs.popoverTrigger.show();
    } else {
      this.refs.popoverTrigger.hide();
    }
  }

  onPopoverAnimationEnd() {
    this.setState({ showNewInfectionRate: false, showNewOutbreaks: false });
    this.props.dispatch(continueTurn());
  }

  render() {
    const { infectionRateValues, getDiseaseStatus } = this.props;
    return (
      <Panel className="top-bar">
        <span className="player-deck">
          <span>{this.props.playerDeckCount}</span>
        </span>
        {DISEASES.map((c) =>
          <span key={c}>
            <span className={classnames(['top-icon',
              {[`cube-icon-${c}`]: getDiseaseStatus(c) === 'active' },
              {[`cured-icon-${c}`]: getDiseaseStatus(c) === 'cured' },
              {[`eradicated-icon-${c}`]: getDiseaseStatus(c) === 'eradicated' }
            ])} />
            <span>{this.props.cubesLeft[c]}</span>
          </span>
        )}

        <span>
          <span className="top-icon stations-icon" />
          <span>{this.props.stationsLeft}</span>
        </span>

        <OverlayTrigger
          id="rates-trigger"
          ref="popoverTrigger"
          trigger={['hover', 'focus']}
          placement="bottom"
          overlay={
            <Popover
              id="rates-popover"
              className="rates-popover">
              <RatesPopover
                infectionRateValues={infectionRateValues}
                outbreaks={this.props.outbreaks}
                showNewInfectionRate={this.state.showNewInfectionRate}
                showNewOutbreaks={this.state.showNewOutbreaks}
                onAnimationEnd={this.onPopoverAnimationEnd} />
            </Popover>
          }>
          <span className="rates">
            <span>
              <span className="top-icon infection-rate-icon" />
              <span>{this.props.infectionRate}</span>
            </span>
            <span>
              <span className="top-icon outbreaks-icon" />
              <span>{this.props.outbreaks}</span>
            </span>
          </span>
        </OverlayTrigger>
      </Panel>
    );
  }
}

const mapStateToProps = (state) => ({
  cubesLeft: state.cubesLeft, stationsLeft: state.stationsLeft, playerDeckCount: getPlayerDeckCount(state),
  infectionRate: getInfectionRate(state), outbreaks: state.outbreaks,
  infectionRateValues: getInfectionRateValues(state),
  getDiseaseStatus: partial(getDiseaseStatus, state)
});

export default connect(mapStateToProps)(TopBar);
