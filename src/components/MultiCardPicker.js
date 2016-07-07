import React from 'react';
import { Button, Panel } from 'react-bootstrap';
import { partial } from 'lodash';


export default class MultiCardPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onCardToggle = this.onCardToggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onCardToggle(id) {
    this.setState({ [id]: !this.state[id] });
  }

  onSubmit() {
    this.props.onSubmit(this.getSelectedIds());
  }

  getSelectedIds() {
    return this.props.cards.filter((c) => !!this.state[c.id]).map((c) => c.id);
  }

  render() {
    const { cards, countNeeded, title } = this.props;
    return (
      <Panel
        header={title}
        footer={
          <div>
            <Button onClick={this.onSubmit} disabled={this.getSelectedIds().length !== countNeeded}>OK</Button>
            <Button onClick={this.props.onCancel}>Cancel</Button>
          </div>
        }
        className="card-picker multi-card-picker">
        {cards.map((c) =>
          <Button
            key={c.id}
            className={`card ${c.cardType}-${c.id} ${!!this.state[c.id] && 'selected'}`}
            onClick={partial(this.onCardToggle, c.id)} />
        )}
      </Panel>
    );
  }
}
