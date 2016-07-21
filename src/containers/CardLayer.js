import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { find, flatten, isEmpty, partial } from 'lodash';
import classnames from 'classnames';

import CardWrapper from '../components/CardWrapper';
import Card from '../components/Card';
import Hand from '../components/Hand';
import CardDrawerDealing from '../components/cardDrawer/CardDrawerDealing';
import CardDrawerInfection from '../components/cardDrawer/CardDrawerInfection';
import { drawCardsHandle } from '../actions/cardActions';
import { animationDrawInfectionCardComplete, animationDealCardsComplete,
  animationDealCardsInitComplete, animationInsertEpidemicCardsComplete, animationDrawCardsInitComplete } from '../actions/globalActions';
import { getCardsDrawn, getInfectionCardDrawn, isEpidemicInProgress, isDealingPlayerCards,
  getPlayerDealtToIndex, getCardsDealtCount, isDealingEpidemicCards, getPlayers, getDifficulty,
  getCurrentPlayerHand, sortHand, isPlaying } from '../selectors';
import { cardProps, cardType, playerType } from '../constants/propTypes';


class CardLayer extends React.Component {
  static propTypes = {
    map: PropTypes.object,
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
    isPlaying: PropTypes.bool.isRequired,
    hand: PropTypes.arrayOf(cardType.isRequired).isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onCardAnimationStart = this.onCardAnimationStart.bind(this);
    this.getPlayerDeck = this.getPlayerDeck.bind(this);
    this.getInfectionDeck = this.getInfectionDeck.bind(this);
    this.state = { startingDraw: false, newPlayerDealing: false, cardsDrawnAnimated: false };
    this.epidemics = [];
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
            { transform: `translate(${c.offsetWidth}px, 0) scale(1) rotateY(180deg)`}
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

  onCardAnimationStart(cardType, id, e) {
    if (['fadeOutDown', 'fadeOutUp', 'flash'].includes(e.animationName)) {
      setTimeout(() => {
        if (!isEmpty(this.props.infectionCardDrawn)) {
          this.props.dispatch(animationDrawInfectionCardComplete());
        } else {
          this.props.dispatch(drawCardsHandle({ cardType, id }, this.props.currentPlayerId));
        }
      }, 500);
    }
  }

  render() {
    const { cardsDrawn, infectionCardDrawn, isEpidemicInProgress, isDealingPlayerCards, playerIndex,
      isDealingEpidemicCards, difficulty, initialInfectedCity, isPlaying } = this.props;
    const isDrawingInfectionCard = !isEmpty(infectionCardDrawn);
    const cards = isDrawingInfectionCard && [{ cardType: 'city', ...infectionCardDrawn }] || cardsDrawn;
    let items = null;
    this.epidemics = [];

    let hand = this.props.hand;

    let drawer;
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
      const completeHandler = isDrawingInfectionCard ? partial(this.props.dispatch, animationDrawInfectionCardComplete()) : undefined;
      drawer = (
        <CardDrawerInfection
          infectedCity={initialInfectedCity || infectionCardDrawn.id}
          infectedLocation={this.props.infectingLocation}
          map={this.props.map}
          getInfectionDeck={this.getInfectionDeck}
          onAnimationComplete={completeHandler} />
      );
    }
    if (!isEmpty(cards)) {
      items = flatten(cards.map((c, i) => {
        if (!isDrawingInfectionCard) {
          if (c.handling || !this.state.startingDraw) {
            if (c.handling && c.cardType !== 'epidemic') {
              hand = sortHand([...hand, c]);
            }
            return (
              <CardWrapper
                key={i}
                {...c}
                className={classnames({
                  'move-to-hand': c.handling && c.cardType !== 'epidemic',
                  'animated flash': c.handling && c.cardType === 'epidemic'
                })}
                onAnimationStart={this.onCardAnimationStart} />
            );
          } else {
            return (
              <div className="card invisible" key={`flip-${c.id}-${i}`}>
                <div className="card front player-deck" />
                <Card
                  {...c}
                  className="back" />
              </div>
            );
          }
        } else {
          return (
            <CardWrapper
              key={i}
              {...c}
              className={classnames(['animated', {
                'fadeInDown': this.state.startingDraw,
                'fadeOutUp': c.handling
              }])}
              onAnimationStart={this.onCardAnimationStart} />
          );
        }

      }));
    }

    if (!drawer) {
      drawer = (
        <div className="card-drawer">
          {items}
        </div>
      );
    }
    return (
      <div className={classnames(['card-layer', {
        'empty': isEmpty(items) && !(isDealingPlayerCards || isDealingEpidemicCards),
        'hide': isEpidemicInProgress }])}>
        <span
          ref="playerDeck"
          className="card player-deck deck-icon" />
        <span
          ref="infectionDeck"
          className="card infection-deck deck-icon" />
        {drawer}
        {isPlaying && <Hand hand={hand} />}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const infectionCardDrawn = getInfectionCardDrawn(state);
  return {
    cardsDrawn: getCardsDrawn(state),
    infectionCardDrawn,
    isEpidemicInProgress: isEpidemicInProgress(state),
    currentPlayerId: state.currentMove.player,
    isDealingPlayerCards: isDealingPlayerCards(state),
    isDealingEpidemicCards: isDealingEpidemicCards(state),
    playerIndex: getPlayerDealtToIndex(state),
    cardsDealtCount: getCardsDealtCount(state),
    players: getPlayers(state),
    difficulty: getDifficulty(state),
    infectingLocation: state.map.locations[ownProps.initialInfectedCity || infectionCardDrawn.id],
    hand: getCurrentPlayerHand(state),
    isPlaying: isPlaying(state)
  };
};

export default connect(mapStateToProps)(CardLayer);
