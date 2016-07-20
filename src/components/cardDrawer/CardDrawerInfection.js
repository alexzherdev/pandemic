import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import Card from '../Card';
import { getLocationOrigin } from '../../utils';
import { locationType } from '../../constants/propTypes';


export default class CardDrawerInfection extends React.Component {
  static propTypes = {
    infectedCity: PropTypes.string,
    infectedLocation: locationType,
    map: PropTypes.object,
    getInfectionDeck: PropTypes.func.isRequired,
    getInfectionDiscard: PropTypes.func.isRequired,
    onAnimationComplete: PropTypes.func
  }

  componentDidMount() {
    this.animateInfection();
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.infectedCity !== this.props.infectedCity;
  }

  componentDidUpdate() {
    this.animateInfection();
  }

  animateInfection() {
    const mapNode = findDOMNode(this.props.map);
    const origin = getLocationOrigin(this.props.infectedLocation);
    const mapOffset = $(mapNode).offset();
    const { infectedCity } = this.refs;
    infectedCity.style.top = `${mapOffset.top + origin.top}px`;
    infectedCity.style.left = `${mapOffset.left + origin.left + 50}px`;
    const src = { top: mapOffset.top + origin.top, left: mapOffset.left + origin.left + 50 };
    const deckOffset = $(this.props.getInfectionDeck()).offset();
    const discardOffset = $(findDOMNode(this.props.getInfectionDiscard())).offset();

    const animation = infectedCity.animate([
      { transform: `translate(${deckOffset.left - src.left}px, ${deckOffset.top - src.top}px) scale(0.2)`, offset: 0 },
      { transform: `translate(${deckOffset.left - src.left}px, ${deckOffset.top - src.top}px) scale(0.2) rotateY(180deg)`, offset: 0.2 },
      { transform: `translate(0, 0) scale(1) rotateY(180deg)`, offset: 0.5 },
      { transform: `translate(0, 0) scale(1) rotateY(180deg)`, offset: 0.7 },
      { transform: `translate(${discardOffset.left - src.left}px, ${discardOffset.top - src.top}px)
        scale(0.2) rotateY(180deg)`, offset: 1 }
    ], {
      duration: 2000,
      fill: 'forwards'
    });
    animation.onfinish = () => setTimeout(this.props.onAnimationComplete, 500);
    $(infectedCity).removeClass('invisible');
  }

  render() {
    const { infectedCity } = this.props;
    return (
      <div className="card-drawer">
        <div
          ref="infectedCity"
          className="card flipper invisible absolute">
          <div className="card front infection-deck" />
          <Card
            cardType="city"
            id={infectedCity}
            className="back" />
        </div>
      </div>
    );
  }
}
