import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import classnames from 'classnames';

import CardWrapper from '../components/CardWrapper';
import { drawCardsHandle } from '../actions/cardActions';
import { animationDrawInfectionCardComplete, animationDealCardsComplete,
  animationDealCardsInitComplete, animationInsertEpidemicCardsComplete } from '../actions/globalActions';
import { getCardsDrawn, getInfectionCardDrawn, isEpidemicInProgress, isDealingPlayerCards,
  getPlayerDealtToIndex, getCardsDealtCount, isDealingEpidemicCards, getPlayers, getDifficulty } from '../selectors';
import { cardProps, playerType } from '../constants/propTypes';
import { getLocationOrigin } from '../utils';


class CardLayer extends React.Component {
  static propTypes = {
    map: PropTypes.element,
    cardsDrawn: PropTypes.arrayOf(PropTypes.shape({
      ...cardProps,
      handling: PropTypes.bool
    })).isRequired,
    isEpidemicInProgress: PropTypes.bool.isRequired,
    difficulty: PropTypes.number.isRequired,
    currentPlayerId: PropTypes.string.isRequired,
    initialInfectedCity: PropTypes.string,
    infectingLocation: PropTypes.object,
    isDealingPlayerCards: PropTypes.bool,
    isDealingEpidemicCards: PropTypes.bool,
    cardsDealtCount: PropTypes.number,
    playerIndex: PropTypes.number,
    infectionCardDrawn: PropTypes.shape({
      id: PropTypes.string,
      handling: PropTypes.bool
    }),
    players: PropTypes.arrayOf(playerType.isRequired).isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onCardAnimationStart = this.onCardAnimationStart.bind(this);
    this.state = { startingDraw: false, startingDealing: false, newPlayerDealing: false };
    this.epidemics = [];
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ startingDraw: this.props.cardsDrawn.length < nextProps.cardsDrawn.length ||
      this.props.infectionCardDrawn !== nextProps.infectionCardDrawn,
      startingDealing: !this.props.isDealingPlayerCards && nextProps.isDealingPlayerCards,
      newPlayerDealing: this.props.playerIndex !== nextProps.playerIndex,
      startingEpidemicInsertion: !this.props.isDealingEpidemicCards && nextProps.isDealingEpidemicCards });
  }

  componentDidUpdate() {
    const { dealDeck, dealCard } = this.refs;
    if (this.state.startingDealing) {
      dealDeck.addEventListener('animationend' , (e) => {
        if (e.animationName === 'fadeInDown') {
          this.props.dispatch(animationDealCardsInitComplete());
        }
      });
    } else {
      const { playerIndex } = this.props;
      const deckOffset = $(dealDeck).offset();

      if (this.state.newPlayerDealing && playerIndex !== null) {
        const { cardsDealtCount, players } = this.props;

        $(dealCard).offset(deckOffset).removeClass('hide');

        let cardsLeftToDeal = cardsDealtCount;

        const animateFn = () => {
          const animation = dealCard.animate([
            { transform: 'translate(0, 0)' },
            { transform: `translate(${window.innerWidth - deckOffset.left}px,
              ${playerIndex / players.length * window.innerHeight - deckOffset.top}px)`}
          ], {
            duration: 200
          });
          cardsLeftToDeal--;
          animation.onfinish = cardsLeftToDeal > 0 ? animateFn : () => {
            this.props.dispatch(animationDealCardsComplete());
          };
        };
        animateFn();
      } else if (this.state.startingEpidemicInsertion) {
        this.epidemics.forEach((el, i) => {
          const cardOffset = $(el).offset();
          setTimeout(function(offset, j) {
            const animation = el.animate([
              { transform: 'translate(0, 0)', opacity: 1 },
              { transform: `translate(${deckOffset.left - offset.left}px,
                ${deckOffset.top - offset.top}px)`, opacity: 0 }
            ], {
              duration: 300,
              fill: 'forwards'
            });

            if (j === this.epidemics.length - 1) {
              animation.onfinish = () =>
                this.props.dispatch(animationInsertEpidemicCardsComplete());
            }
          }.bind(this, cardOffset, i), 300 * (i + 1));
        });
      } else if (this.props.initialInfectedCity !== null) {
        const mapNode = findDOMNode(this.props.map);
        const origin = getLocationOrigin(this.props.infectingLocation);
        const offset = $(mapNode).offset();

        this.refs.infectedCity.style.top = `${offset.top + origin.top}px`;
        this.refs.infectedCity.style.left = `${offset.left + origin.left + 50}px`;
      }
    }
  }

  onCardAnimationStart(cardType, id, e) {
    if (['fadeOutDown', 'fadeOutUp', 'flash'].includes(e.animationName)) {
      setTimeout(() => {
        if (!isEmpty(this.props.infectionCardDrawn)) {
          this.props.dispatch(animationDrawInfectionCardComplete());
        } else {
          this.props.dispatch(drawCardsHandle({ cardType, id }, this.props.currentPlayerId));
        }
      }, 1000);
    }
  }

  render() {
    const { cardsDrawn, infectionCardDrawn, isEpidemicInProgress, isDealingPlayerCards, playerIndex,
      isDealingEpidemicCards, difficulty, initialInfectedCity } = this.props;
    const cards = !isEmpty(infectionCardDrawn) && [{ cardType: 'city', ...infectionCardDrawn }] || cardsDrawn;
    let items = null;
    this.epidemics = [];

    if (!isEmpty(cards)) {
      items = cards.map((c, i) =>
        <CardWrapper
          key={i}
          {...c}
          className={classnames(['animated', {
            'fadeInDown': this.state.startingDraw,
            'fadeOutDown': isEmpty(infectionCardDrawn) && c.handling && c.cardType !== 'epidemic',
            'fadeOutUp': !isEmpty(infectionCardDrawn) && c.handling,
            'flash': c.handling && c.cardType === 'epidemic'
          }])}
          onAnimationStart={this.onCardAnimationStart} />);
    } else if (isDealingPlayerCards) {
      items = [
        <div
          key="dealDeck"
          ref="dealDeck"
          className="card player-deck animated fadeInDown" />,
        playerIndex !== null &&
          <div
            key="dealCard"
            ref="dealCard"
            className="card player-deck dealing hide" />
      ];
    } else if (isDealingEpidemicCards) {
      items = [
        <div
          key="dealDeck"
          ref="dealDeck"
          className="card player-deck" />,
        <div
          key="epidemics"
          className="epidemics">
          {Array(difficulty).fill().map((_, i) =>
            <div
              key={i}
              ref={(el) => el !== null && this.epidemics.push(el)}
              className="card epidemic" />)
          }
        </div>
      ];
    } else if (initialInfectedCity !== null) {
      items = (
        <div
          key={initialInfectedCity}
          ref="infectedCity"
          className={`infection card animated fadeInDown city-${initialInfectedCity}`} />);
    }

    return (
      <div className={classnames(['card-layer', {
        'empty': isEmpty(items),
        'is-epidemic': isEpidemicInProgress }])}>
        <div className="card-drawer">
          {items}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  cardsDrawn: getCardsDrawn(state),
  infectionCardDrawn: getInfectionCardDrawn(state),
  isEpidemicInProgress: isEpidemicInProgress(state),
  currentPlayerId: state.currentMove.player,
  isDealingPlayerCards: isDealingPlayerCards(state),
  isDealingEpidemicCards: isDealingEpidemicCards(state),
  playerIndex: getPlayerDealtToIndex(state),
  cardsDealtCount: getCardsDealtCount(state),
  players: getPlayers(state),
  difficulty: getDifficulty(state),
  infectingLocation: state.map.locations[ownProps.initialInfectedCity]
});

export default connect(mapStateToProps)(CardLayer);
