import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { find, isEmpty, partial } from 'lodash';
import classnames from 'classnames';

import Hand from '../components/Hand';
import CardDrawerDealing from '../components/cardDrawer/CardDrawerDealing';
import CardDrawerInfection from '../components/cardDrawer/CardDrawerInfection';
import CardDrawerEpidemicInfection from '../components/cardDrawer/CardDrawerEpidemicInfection';
import CardDrawerEpidemicIntensify from '../components/cardDrawer/CardDrawerEpidemicIntensify';
import CardDrawerDiscardingPlayerCard from '../components/cardDrawer/CardDrawerDiscardingPlayerCard';
import CardDrawerDrawingPlayerCards from '../components/cardDrawer/CardDrawerDrawingPlayerCards';
import DiscardPile from '../components/DiscardPile';
import { drawCardsHandle, epidemicIntensify } from '../actions/cardActions';
import { animationDrawInfectionCardComplete, animationDealCardsComplete,
  animationDealCardsInitComplete, animationInsertEpidemicCardsComplete, animationDrawCardsInitComplete,
  animationCardDiscardFromHandComplete, continueTurn } from '../actions/globalActions';
import { getCardsDrawn, getInfectionCardDrawn, isDealingPlayerCards,
  getPlayerDealtToIndex, getCardsDealtCount, isDealingEpidemicCards, getPlayers, getDifficulty,
  getCurrentPlayerHand, sortHand, isPlaying, getDiscardingCard, getPlayerDiscardTop, getInfectionDiscardTop,
  getEpidemicInfectionCard, getEpidemicStep } from '../selectors';
import { cardProps, cardType, playerType } from '../constants/propTypes';


class CardLayer extends React.Component {
  static propTypes = {
    map: PropTypes.object,
    cardsDrawn: PropTypes.arrayOf(PropTypes.shape({
      ...cardProps,
      handling: PropTypes.bool
    })).isRequired,
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
    epidemicInfectionCard: PropTypes.shape({
      id: PropTypes.string
    }),
    epidemicStep: PropTypes.string,
    players: PropTypes.arrayOf(playerType.isRequired).isRequired,
    isPlaying: PropTypes.bool.isRequired,
    hand: PropTypes.arrayOf(cardType.isRequired),
    discardingCard: cardType,
    playerDiscardTop: cardType,
    infectionDiscardTop: cardType,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onEpidemicHandle = this.onEpidemicHandle.bind(this);
    this.getPlayerDeck = this.getPlayerDeck.bind(this);
    this.getInfectionDeck = this.getInfectionDeck.bind(this);
    this.getPlayerDiscard = this.getPlayerDiscard.bind(this);
    this.getInfectionDiscard = this.getInfectionDiscard.bind(this);
    this.state = { startingDraw: false, newPlayerDealing: false, cardsDrawnAnimated: false };
  }

  componentWillReceiveProps(nextProps) {
    const startingInfectionDraw = this.props.infectionCardDrawn !== nextProps.infectionCardDrawn;
    this.setState({
      startingDraw: this.props.cardsDrawn.length < nextProps.cardsDrawn.length || startingInfectionDraw,
      newPlayerDealing: this.props.playerIndex !== nextProps.playerIndex,
      startingEpidemicInsertion: !this.props.isDealingEpidemicCards && nextProps.isDealingEpidemicCards
    });
    if (this.state.cardsDrawnAnimated && this.props.currentPlayerId !== nextProps.currentPlayerId) {
      this.setState({ cardsDrawnAnimated: false });
    }
  }

  componentDidUpdate() {
    if (!isEmpty(this.props.cardsDrawn)) {
      if (!this.state.cardsDrawnAnimated) {
        const cardEls = document.querySelectorAll('.card-drawer .card.invisible');
        const offsets = $(cardEls).map(function() { return $(this).offset(); });
        const playerDeckOffset = $(this.refs.playerDeck).offset();
        $(cardEls).addClass('flipper').removeClass('invisible');

        let animationCompleteCounter = 2;
        cardEls.forEach((c, i) => {
          const anim = c.animate([
            { transform: `translate(${playerDeckOffset.left - offsets[i].left}px, ${playerDeckOffset.top -
              offsets[i].top}px) scale(0.2)`},
            { transform: `translate(0, 0) scale(1) rotateY(180deg)`}
          ], {
            duration: 500,
            fill: 'forwards'
          });

          anim.onfinish = () => {
            animationCompleteCounter--;
            if (animationCompleteCounter === 0) {
              this.setState({ cardsDrawnAnimated: true });
              this.props.dispatch(animationDrawCardsInitComplete());
            }
          };
        });
      } else {
        const movedInHand = document.querySelector('.hand .card.invisible');
        const movedInDrawer = document.querySelector('.card-drawer .move-to-hand');
        if (movedInHand && movedInDrawer) {
          const src = $(movedInDrawer).offset();
          const dest = $(movedInHand).offset();
          const anim = movedInHand.animate([
            { transform: `translate(${src.left - dest.left}px, ${src.top - dest.top}px)` },
            { transform: 'translate(0, 0)' }
          ], {
            duration: 500,
            fill: 'forwards'
          });
          $(movedInHand).removeClass('invisible');
          $(movedInDrawer).addClass('invisible');
          anim.onfinish = () => {
            const card = find(this.props.cardsDrawn, { handling: true });
            this.props.dispatch(drawCardsHandle({ cardType: card.cardType, id: card.id }, this.props.currentPlayerId));
          };
        }
      }
    }
  }

  getPlayerDeck() {
    return this.refs.playerDeck;
  }

  getInfectionDeck() {
    return this.refs.infectionDeck;
  }

  getPlayerDiscard() {
    return this.refs.playerDiscard;
  }

  getInfectionDiscard() {
    return this.refs.infectionDiscard;
  }

  onEpidemicHandle(cardType, id) {
    this.props.dispatch(drawCardsHandle({ cardType, id }, this.props.currentPlayerId));
  }

  render() {
    const { cardsDrawn, infectionCardDrawn, isDealingPlayerCards, playerIndex,
      isDealingEpidemicCards, difficulty, initialInfectedCity, isPlaying, discardingCard, playerDiscardTop,
      infectionDiscardTop, epidemicInfectionCard, epidemicStep, currentPlayerId } = this.props;
    const isDrawingInfectionCard = !isEmpty(infectionCardDrawn);

    let hand = this.props.hand;

    let drawer;

    const infectionDiscard = (
      <DiscardPile
        ref="infectionDiscard"
        className="infection-discard"
        discardTop={infectionDiscardTop} />
    );
    if (isDealingPlayerCards || isDealingEpidemicCards) {
      drawer = (
        <CardDrawerDealing
          isDealingEpidemicCards={isDealingEpidemicCards}
          difficulty={difficulty}
          playerIndex={playerIndex}
          newPlayerDealing={this.state.newPlayerDealing}
          cardsDealtCount={this.props.cardsDealtCount}
          getPlayerDeck={this.getPlayerDeck}
          players={this.props.players}
          startingEpidemicInsertion={this.state.startingEpidemicInsertion}
          onDealCardsInitComplete={partial(this.props.dispatch, animationDealCardsInitComplete())}
          onDealCardsComplete={partial(this.props.dispatch, animationDealCardsComplete())}
          onInsertEpidemicCardsComplete={partial(this.props.dispatch, animationInsertEpidemicCardsComplete())}
          />
      );
    } else if (initialInfectedCity !== null || isDrawingInfectionCard) {
      drawer = (
        <CardDrawerInfection
          infectedCity={initialInfectedCity || infectionCardDrawn.id}
          infectedLocation={this.props.infectingLocation}
          map={this.props.map}
          getInfectionDeck={this.getInfectionDeck}
          getInfectionDiscard={this.getInfectionDiscard}
          onAnimationComplete={partial(this.props.dispatch, animationDrawInfectionCardComplete())} />
      );
    } else if (!isEmpty(discardingCard)) {
      drawer = (
        <CardDrawerDiscardingPlayerCard
          card={discardingCard}
          getPlayerDiscard={this.getPlayerDiscard}
          isCurrentPlayerDiscarding={discardingCard.playerId === currentPlayerId}
          onAnimationComplete={partial(this.props.dispatch,
            animationCardDiscardFromHandComplete(discardingCard.cardType, discardingCard.playerId, discardingCard.id))} />
      );
    } else if (!isEmpty(epidemicInfectionCard)) {
      drawer = (
        <CardDrawerEpidemicInfection
          getInfectionDeck={this.getInfectionDeck}
          getInfectionDiscard={this.getInfectionDiscard}
          infectionCard={epidemicInfectionCard}
          onAnimationComplete={partial(this.props.dispatch, continueTurn())} />
      );
    } else if (epidemicStep === 'intensify') {
      drawer = (
        <CardDrawerEpidemicIntensify
          getInfectionDeck={this.getInfectionDeck}
          infectionDiscard={infectionDiscard}
          getInfectionDiscard={this.getInfectionDiscard}
          onAnimationComplete={partial(this.props.dispatch, epidemicIntensify())} />
      );
    } else if (!isEmpty(cardsDrawn)) {
      drawer = (
        <CardDrawerDrawingPlayerCards
          cards={cardsDrawn}
          startingDraw={this.state.startingDraw}
          onEpidemicHandle={this.onEpidemicHandle} />
      );
    }

    const empty = !drawer;
    if (empty) {
      drawer = (
        <div className="card-drawer" />
      );
    }

    if (!isEmpty(cardsDrawn)) {
      for (let i = 0; i < cardsDrawn.length; i++) {
        const c = cardsDrawn[i];
        if (c.handling && c.cardType !== 'epidemic') {
          hand = sortHand([...hand, c]);
          break;
        }
      }
    }
    if (!isEmpty(discardingCard)) {
      hand = hand.filter((c) => c.id !== discardingCard.id || c.cardType !== discardingCard.cardType);
    }
    return (
      <div className={classnames(['card-layer', {
        'empty': empty
      }])}>
        <DiscardPile
          ref="playerDiscard"
          className="player-discard"
          discardTop={playerDiscardTop} />
        <span
          ref="playerDeck"
          className="card player-deck deck-icon" />
        <span
          ref="infectionDeck"
          className="card infection-deck deck-icon" />
        {infectionDiscard}
        {drawer}
        {isPlaying && <Hand hand={hand} />}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const infectionCardDrawn = getInfectionCardDrawn(state);

  let props = {
    cardsDrawn: getCardsDrawn(state),
    infectionCardDrawn,
    discardingCard: getDiscardingCard(state),
    currentPlayerId: state.currentMove.player,
    isDealingPlayerCards: isDealingPlayerCards(state),
    isDealingEpidemicCards: isDealingEpidemicCards(state),
    playerIndex: getPlayerDealtToIndex(state),
    cardsDealtCount: getCardsDealtCount(state),
    players: getPlayers(state),
    difficulty: getDifficulty(state),
    infectingLocation: state.map.locations[ownProps.initialInfectedCity || infectionCardDrawn.id],
    isPlaying: isPlaying(state),
    playerDiscardTop: getPlayerDiscardTop(state),
    infectionDiscardTop: getInfectionDiscardTop(state),
    epidemicInfectionCard: getEpidemicInfectionCard(state),
    epidemicStep: getEpidemicStep(state)
  };
  if (props.isPlaying) {
    props = {
      ...props,
      hand: getCurrentPlayerHand(state)
    };
  }
  return props;
};

export default connect(mapStateToProps)(CardLayer);
