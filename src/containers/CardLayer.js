import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import classnames from 'classnames';

import CardWrapper from '../components/CardWrapper';
import { drawCardsHandle } from '../actions/cardActions';
import { getCardsDrawn, isEpidemicInProgress } from '../selectors';
import { cardProps } from '../constants/propTypes';


class CardLayer extends React.Component {
  static propTypes = {
    cardsDrawn: PropTypes.arrayOf(PropTypes.shape({
      ...cardProps,
      handling: PropTypes.bool
    })).isRequired,
    isEpidemicInProgress: PropTypes.bool.isRequired,
    currentPlayerId: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onCardAnimationStart = this.onCardAnimationStart.bind(this);
    this.state = { startingDraw: false };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ startingDraw: this.props.cardsDrawn.length < nextProps.cardsDrawn.length });
  }

  onCardAnimationStart(cardType, id, e) {
    if (e.animationName === 'fadeOutDown' || e.animationName === 'flash') {
      setTimeout(() => {
        this.props.dispatch(drawCardsHandle({ cardType, id }, this.props.currentPlayerId));
      }, 1000);
    }
  }

  render() {
    const { cardsDrawn, isEpidemicInProgress } = this.props;
    const cards = cardsDrawn.map((c, i) =>
      <CardWrapper
        key={i}
        {...c}
        className={classnames(['animated', {
          'fadeInDown': this.state.startingDraw,
          'fadeOutDown': c.handling && c.cardType !== 'epidemic',
          'flash': c.handling && c.cardType === 'epidemic'
        }])}
        onAnimationStart={this.onCardAnimationStart} />);

    return (
      <div className={classnames(['card-layer', { 'empty': isEmpty(cardsDrawn), 'is-epidemic': isEpidemicInProgress }])}>
        <div className="card-drawer">
          {cards}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  cardsDrawn: getCardsDrawn(state),
  isEpidemicInProgress: isEpidemicInProgress(state),
  currentPlayerId: state.currentMove.player
});

export default connect(mapStateToProps)(CardLayer);
