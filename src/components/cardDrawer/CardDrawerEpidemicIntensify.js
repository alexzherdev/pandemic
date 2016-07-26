import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';


export default class CardDrawerEpidemicIntensify extends React.Component {
  static propTypes = {
    getInfectionDiscard: PropTypes.func.isRequired,
    getInfectionDeck: PropTypes.func.isRequired,
    onAnimationComplete: PropTypes.func.isRequired,
    infectionDiscard: PropTypes.node
  }

  componentDidMount() {
    const discard = findDOMNode(this.props.getInfectionDiscard());
    const discardOffset = $(discard).offset();
    const { innerDiscard, discardCopy, highDeckLeft, highDeckRight } = this.refs;
    $(findDOMNode(innerDiscard)).removeClass('deck-icon').addClass('front');
    const src = $(discardCopy).offset();
    $(discard).addClass('empty');

    const zoomDiscard = discardCopy.animate([
      { transform: `translate(${discardOffset.left - src.left}px, ${discardOffset.top - src.top}px) scale(0.2)`},
      { transform: `translate(0px, 0) scale(1)`}
    ], {
      duration: 500,
      fill: 'forwards'
    });
    zoomDiscard.onfinish = () => {
      const flip = discardCopy.animate([
        { transform: `translate(0px, 0) rotateY(0deg)` },
        { transform: `translate(0px, 0) rotateY(180deg)` }
      ], {
        delay: 300,
        duration: 500,
        fill: 'forwards'
      });

      flip.onfinish = () => {
        setTimeout(() => {
          const { resultDeck } = this.refs;
          $(discardCopy).addClass('hide');
          $(highDeckLeft).removeClass('hide');
          $(highDeckRight).removeClass('hide');

          $(resultDeck).removeClass('hide').addClass('invisible');
          let resultOffset = $(resultDeck).find('.high-deck-container').offset();

          const leftDeckDest = $(highDeckLeft).offset();
          const rightDeckDest = $(highDeckRight).offset();
          $(highDeckLeft).find('.high-deck').removeClass('high-deck');
          const leftAnim = highDeckLeft.animate([
            { transform: `translate(${resultOffset.left - leftDeckDest.left}px, ${resultOffset.top - leftDeckDest.top}px)` },
            { transform: `translate(0, 0)` }
          ], {
            duration: 500,
            fill: 'forwards'
          });
          leftAnim.onfinish = () => {
            $(highDeckLeft).find('.card div').addClass('high-deck high-3');
          };
          $(highDeckRight).find('.high-deck').removeClass('high-deck');
          const rightAnim = highDeckRight.animate([
            { transform: `translate(${resultOffset.left - rightDeckDest.left}px, ${resultOffset.top - rightDeckDest.top}px)` },
            { transform: `translate(0, 0)` }
          ], {
            duration: 500,
            fill: 'forwards'
          });

          rightAnim.onfinish = () => {
            $(highDeckRight).find('.card div').addClass('high-deck high-3');
            setTimeout(() => {
              this.shuffle();
            }, 500);
          };
        }, 500);
      };
    };
  }

  shuffle() {
    const { shuffleCard, resultDeck, highDeckLeft, highDeckRight } = this.refs;
    const infectionDeck = this.props.getInfectionDeck();
    const CARDS_TO_SHUFFLE = 40;
    let animationsLeft = CARDS_TO_SHUFFLE;
    $(shuffleCard).removeClass('hide');
    $(resultDeck).removeClass('hide').addClass('invisible');
    const animateFn = () => {
      const deck = animationsLeft % 2 === 0 ? highDeckLeft : highDeckRight;
      const deckOffset = $(deck).find('.high-deck-container').offset();
      let resultOffset = $(resultDeck).find('.high-deck-container').offset();
      $(shuffleCard).offset(deckOffset);
      const shuffle = shuffleCard.animate([
        { transform: `translate(0, 0)` },
        { transform: `translate(${resultOffset.left - deckOffset.left}px, ${resultOffset.top - deckOffset.top}px)` }
      ], {
        duration: 50,
        fill: 'none'
      });
      const currentEmptyingIndex = Math.floor(animationsLeft / CARDS_TO_SHUFFLE * 3.0);
      $(deck).find('.high-deck, .high-deck-container').removeClass(`high-${currentEmptyingIndex + 1}`)
        .addClass(`high-${currentEmptyingIndex}`);

      const currentFillingIndex = Math.floor((CARDS_TO_SHUFFLE - animationsLeft) / CARDS_TO_SHUFFLE * 7.0);
      $(resultDeck).find('.high-deck, .high-deck-container').removeClass(`high-${currentFillingIndex - 1}`)
        .addClass(`high-${currentFillingIndex}`);

      animationsLeft--;
      shuffle.onfinish = animationsLeft ? (() => {
        $(resultDeck).removeClass('invisible').find('.high-deck').addClass('high-1');
        animateFn();
      }) : (() => {
        $(highDeckLeft).addClass('invisible');
        $(highDeckRight).addClass('invisible');
        $(shuffleCard).addClass('invisible');
        const infectionDeckOffset = $(findDOMNode(infectionDeck)).offset();
        resultOffset = $(resultDeck).offset();
        setTimeout(() => {
          $(resultDeck).find('.high-deck').removeClass('high-deck');
          const returnToDiscard = resultDeck.animate([
            { transform: 'translate(0, 0) scale(1)' },
            { transform: `translate(${infectionDeckOffset.left - resultOffset.left}px, ${infectionDeckOffset.top - resultOffset.top}px) scale(0.2)` }
          ], {
            duration: 500,
            fill: 'forwards'
          });
          returnToDiscard.onfinish = this.props.onAnimationComplete;
        }, 500);
      });
    };
    animateFn();
  }

  render() {
    return (
      <div className="card-drawer">
        <div
          ref="discardCopy"
          className="card flipper">
          {React.cloneElement(this.props.infectionDiscard, { ref: 'innerDiscard' })}
          <div className="card infection-deck back" />
        </div>
        <div
          ref="highDeckLeft"
          className="card hide">
          <div className="card infection-deck high-deck-container high-3">
            <div className="high-deck high-3" />
          </div>
        </div>
        <div
          ref="resultDeck"
          className="card result-deck hide">
          <div className="card infection-deck high-deck-container">
            <div className="high-deck" />
          </div>
        </div>
        <div
          ref="shuffleCard"
          className="card infection-deck hide shuffle-card" />
        <div
          ref="highDeckRight"
          className="card hide">
          <div className="card infection-deck high-deck-container high-3">
            <div className="high-deck high-3" />
          </div>
        </div>
      </div>
    );
  }
}
