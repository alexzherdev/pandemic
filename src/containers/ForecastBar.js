import React, { PropTypes } from 'react';
import { Panel, Button } from 'react-bootstrap';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { partial } from 'lodash';

import DraggableCard from '../components/DraggableCard';


@DragDropContext(HTML5Backend)
export default class ForecastBar extends React.Component {
  static propTypes = {
    cards: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onSubmit: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.moveCard = this.moveCard.bind(this);
    this.state = { cards: this.props.cards.slice() };
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];
    const newCards = cards.slice();
    newCards.splice(dragIndex, 1);
    newCards.splice(hoverIndex, 0, dragCard);
    this.setState({ cards: newCards });
  }

  render() {
    return (
      <Panel
        header="Specify the order (left to right -> top to bottom):"
        className="forecast-bar card-picker"
        footer={
          <div>
            <Button
              bsStyle="primary"
              onClick={partial(this.props.onSubmit, this.state.cards)}>OK</Button>
          </div>
        }>
        {this.state.cards.map((c, i) =>
          <DraggableCard
            key={c}
            cardType="city"
            id={c}
            index={i}
            moveCard={this.moveCard} />
        )}
      </Panel>
    );
  }
}
