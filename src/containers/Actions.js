import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { partial, isEmpty, shuffle } from 'lodash';
import { Button, Panel, Glyphicon } from 'react-bootstrap';
import pluralize from 'pluralize';

import * as mapActions from '../actions/mapActions';
import * as diseaseActions from '../actions/diseaseActions';
import * as cardActions from '../actions/cardActions';
import * as globalActions from '../actions/globalActions';
import { getCurrentCityId, canBuildStation, canTreatAll,
  getCurrentPlayer, canShareCards, getContPlannerEvent, isContingencyPlannerAbilityAvailable,
  getCurableDisease, getTreatableDiseases, getEventsInHands } from '../selectors';
import { playerType, diseaseType, eventCardType } from '../constants/propTypes';


class Actions extends React.Component {
  static propTypes = {
    onShowTreatColors: PropTypes.func.isRequired,
    onTreatColorPicked: PropTypes.func.isRequired,
    onMoveInit: PropTypes.func.isRequired,
    onPlayEventClicked: PropTypes.func.isRequired,

    currentMove: PropTypes.object.isRequired,
    currentCityId: PropTypes.string.isRequired,
    canBuildStation: PropTypes.bool.isRequired,
    canTreatAll: PropTypes.bool.isRequired,
    curableDisease: diseaseType,
    treatableDiseases: PropTypes.objectOf(PropTypes.number.isRequired),
    currentPlayer: playerType.isRequired,
    canShareCards: PropTypes.bool.isRequired,
    contPlannerEvent: PropTypes.object,
    isContingencyPlannerAbilityAvailable: PropTypes.bool.isRequired,
    events: PropTypes.arrayOf(eventCardType.isRequired).isRequired,
    actions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.onForecastShuffled = this.onForecastShuffled.bind(this);
    this.onTreatClicked = this.onTreatClicked.bind(this);
  }

  onTreatClicked() {
    const { treatableDiseases } = this.props;
    if (Object.keys(treatableDiseases).length > 1) {
      this.props.onShowTreatColors();
    } else {
      const color = Object.keys(treatableDiseases)[0];
      this.props.onTreatColorPicked(color);
    }
  }

  onForecastShuffled() {
    this.props.actions.forecastShuffle(shuffle([...this.props.currentMove.forecastCards]));
  }


  render() {
    const { shareCandidates, forecastCards, actionsLeft } = this.props.currentMove;
    const { isContingencyPlannerAbilityAvailable,
      contPlannerEvent, treatableDiseases, canTreatAll, currentPlayer, events } = this.props;
    return (
      <Panel
        className="actions"
        footer={`${currentPlayer.name}'s turn, ${pluralize('action', actionsLeft, true)} left`}>
        <Button
          onClick={this.props.onMoveInit}>
            <i className="fa fa-car" /> / <i className="fa fa-plane" /><div>Move</div></Button>
        <Button
          onClick={partial(this.props.actions.buildStation, this.props.currentCityId)}
          disabled={!this.props.canBuildStation}>
          <i className="fa fa-building" /><div>Build</div></Button>
        <Button
          onClick={this.props.actions.shareCardsInit}
          disabled={!this.props.canShareCards || !isEmpty(shareCandidates)}>
          <Glyphicon glyph="book" /><div>Share</div></Button>
        <Button
          onClick={this.onTreatClicked}
          disabled={isEmpty(treatableDiseases)}>
          <i className="fa fa-medkit" />
          <div>{canTreatAll ? 'Treat All' : 'Treat'}</div>
        </Button>
        <Button
          onClick={partial(this.props.actions.cureDiseaseInit, this.props.curableDisease)}
          disabled={!this.props.curableDisease}>
          <i className="fa fa-flask" />
          <div>Cure</div>
        </Button>

        {!isEmpty(forecastCards) &&
          <Button onClick={this.onForecastShuffled}>Shuffle</Button>
        }

        {isContingencyPlannerAbilityAvailable &&
          <Button
            onClick={partial(this.props.actions.contPlannerInit, this.props.currentPlayer.id)}>
            <Glyphicon glyph="open" /><div>Retrieve</div>
          </Button>
        }
        {!isEmpty(contPlannerEvent) &&
          <Button
            className={`card event-icon event-${contPlannerEvent.id}`}
            onClick={partial(this.props.actions.playEventInit, this.props.currentPlayer.id,
            contPlannerEvent.id)} />
        }
        {!isEmpty(events) &&
          <Button
            onClick={this.props.onPlayEventClicked}
            title="Play an event"
            className="play-event">
            <img />
          </Button>
        }
      </Panel>
    );
  }
}

const mapStateToProps = (state) => {
  return { currentMove: state.currentMove, currentCityId: getCurrentCityId(state),
    canBuildStation: canBuildStation(state), canTreatAll: canTreatAll(state),
    curableDisease: getCurableDisease(state), treatableDiseases: getTreatableDiseases(state),
    currentPlayer: getCurrentPlayer(state), canShareCards: canShareCards(state),
    contPlannerEvent: getContPlannerEvent(state),
    isContingencyPlannerAbilityAvailable: isContingencyPlannerAbilityAvailable(state),
    events: getEventsInHands(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ ...mapActions, ...diseaseActions, ...cardActions, ...globalActions }, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Actions);
