import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import { find, flatten, isEmpty } from 'lodash';
import classnames from 'classnames';

import CardWrapper from '../components/CardWrapper';
import Card from '../components/Card';
import Hand from '../components/Hand';
import { drawCardsHandle } from '../actions/cardActions';
import { animationDrawInfectionCardComplete, animationDealCardsComplete,
  animationDealCardsInitComplete, animationInsertEpidemicCardsComplete, animationDrawCardsInitComplete } from '../actions/globalActions';
import { getCardsDrawn, getInfectionCardDrawn, isEpidemicInProgress, isDealingPlayerCards,
  getPlayerDealtToIndex, getCardsDealtCount, isDealingEpidemicCards, getPlayers, getDifficulty,
  getCurrentPlayerHand, sortHand, isPlaying } from '../selectors';
import { cardProps, cardType, playerType } from '../constants/propTypes';
import { getLocationOrigin } from '../utils';


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
    this.state = { startingDraw: false, startingDealing: false,
      newPlayerDealing: false, cardsDrawnAnimated: false };
    this.epidemics = [];
  }

  componentWillReceiveProps(nextProps) {
    const startingInfectionDraw = this.props.infectionCardDrawn !== nextProps.infectionCardDrawn;
    this.setState({ startingDraw: this.props.cardsDrawn.length < nextProps.cardsDrawn.length ||
        startingInfectionDraw,
      startingDealing: !this.props.isDealingPlayerCards && nextProps.isDealingPlayerCards,
      newPlayerDealing: this.props.playerIndex !== nextProps.playerIndex,
      startingEpidemicInsertion: !this.props.isDealingEpidemicCards && nextProps.isDealingEpidemicCards });
  }

  componentDidUpdate() {
    const { dealDeck, dealCard } = this.refs;
    if (this.state.startingDealing) {
      const playerDeckOffset = $(this.refs.playerDeck).offset();
      const src = $(dealDeck).offset();
      const anim = dealDeck.animate([
        { transform: `translate(${playerDeckOffset.left - src.left}px,
          ${playerDeckOffset.top - src.top}px) scale(0.2)` },
        { transform: `translate(0, 0) scale(1)` }
      ], {
        duration: 500,
        fill: 'forwards'
      });
      $(this.refs.playerDeck).addClass('empty');
      $(dealDeck).removeClass('invisible');
      anim.onfinish = () => this.props.dispatch(animationDealCardsInitComplete());
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
              animation.onfinish = () => {
                setTimeout(() => {
                  const playerDeckOffset = $(this.refs.playerDeck).offset();
                  const src = $(this.refs.dealDeck).offset();
                  const anim = this.refs.dealDeck.animate([
                    { transform: `translate(0, 0) scale(1)` },
                    { transform: `translate(${playerDeckOffset.left - src.left}px, ${playerDeckOffset.top - src.top}px) scale(0.2)` }
                  ], {
                    duration: 500,
                    fill: 'forwards'
                  });
                  anim.onfinish = () => {
                    $(this.refs.playerDeck).removeClass('empty');
                    this.props.dispatch(animationInsertEpidemicCardsComplete());
                  };
                }, 500);
              };
            }
          }.bind(this, cardOffset, i), 300 * (i + 1));
        });
      } else if (this.props.initialInfectedCity !== null) {
        const mapNode = findDOMNode(this.props.map);
        const origin = getLocationOrigin(this.props.infectingLocation);
        const offset = $(mapNode).offset();

        this.refs.infectedCity.style.top = `${offset.top + origin.top}px`;
        this.refs.infectedCity.style.left = `${offset.left + origin.left + 50}px`;
      } else if (!isEmpty(this.props.cardsDrawn)) {
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
                <div className="front player-deck-icon" />
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
    } else if (isDealingPlayerCards) {
      items = [
        <div
          key="dealDeck"
          ref="dealDeck"
          className={classnames(['card', 'player-deck', { 'invisible': playerIndex === null }])} />,
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
        'hide': isEpidemicInProgress }])}>
        <span
          ref="playerDeck"
          className="player-deck-icon" />
        <div className="card-drawer">
          {items}
        </div>
        {isPlaying && <Hand hand={hand} />}
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
  infectingLocation: state.map.locations[ownProps.initialInfectedCity],
  hand: getCurrentPlayerHand(state),
  isPlaying: isPlaying(state)
});

export default connect(mapStateToProps)(CardLayer);
