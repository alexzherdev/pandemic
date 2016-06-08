import React from 'react';


export default class MultiCardPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onCardSelect = this.onCardSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onCardSelect(event) {
    this.setState({ [event.target.dataset.id]: event.target.checked });
  }

  onSubmit() {
    this.props.onSubmit(this.getSelectedIds());
  }

  getSelectedIds() {
    return this.props.cards.filter((c) => !!this.state[c.id]).map((c) => c.id);
  }

  render() {
    const { cards, countNeeded } = this.props;
    return (
      <div>
        {cards.map((c) =>
          <span key={c.id}><input type="checkbox" data-id={c.id} onChange={this.onCardSelect} />{c.name}</span>
        )}
        <button onClick={this.onSubmit} disabled={this.getSelectedIds().length !== countNeeded}>OK</button>
        <button onClick={this.props.onCancel}>Cancel</button>
      </div>
    );
  }
}
