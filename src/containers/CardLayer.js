import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import classnames from 'classnames';

import CardWrapper from '../components/CardWrapper';
import { drawCardsHandle } from '../actions/cardActions';
import { animationDrawInfectionCardComplete } from '../actions/globalActions';
import { getCardsDrawn, getInfectionCardDrawn, isEpidemicInProgress } from '../selectors';
import { cardProps } from '../constants/propTypes';


class CardLayer extends React.Component {
  static propTypes = {
    cardsDrawn: PropTypes.arrayOf(PropTypes.shape({
      ...cardProps,
      handling: PropTypes.bool
    })).isRequired,
    isEpidemicInProgress: PropTypes.bool.isRequired,
    currentPlayerId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    infectionCardDrawn: PropTypes.shape({
      id: PropTypes.string,
      handling: PropTypes.bool
    })
  }

  constructor(props) {
    super(props);
    this.onCardAnimationStart = this.onCardAnimationStart.bind(this);
    this.state = { startingDraw: false };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ startingDraw: this.props.cardsDrawn.length < nextProps.cardsDrawn.length ||
      this.props.infectionCardDrawn !== nextProps.infectionCardDrawn });
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
    const { cardsDrawn, infectionCardDrawn, isEpidemicInProgress } = this.props;
    const cards = !isEmpty(infectionCardDrawn) && [{ cardType: 'city', ...infectionCardDrawn }] || cardsDrawn;
    const items = cards.map((c, i) =>
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

    return (
      <div className={classnames(['card-layer', {
        'empty': isEmpty(cardsDrawn) && isEmpty(infectionCardDrawn),
        'is-epidemic': isEpidemicInProgress }])}>
        <div className="card-drawer">
          {items}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cardsDrawn: getCardsDrawn(state),
  infectionCardDrawn: getInfectionCardDrawn(state),
  isEpidemicInProgress: isEpidemicInProgress(state),
  currentPlayerId: state.currentMove.player
});

export default connect(mapStateToProps)(CardLayer);
