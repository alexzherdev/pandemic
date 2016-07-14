import React, { PropTypes } from 'react';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import { difference, find, map, partial, partialRight, sample } from 'lodash';
import classnames from 'classnames';

import CustomGamePlayer from '../components/setup/CustomGamePlayer';
import NAMES from '../constants/names';
import ROLES from '../constants/roles';


const DIFFICULTIES = {
  4: 'Introductory',
  5: 'Standard',
  6: 'Heroic'
};

const STORAGE_KEY = 'CUSTOM_GAME_SETTINGS';

export default class CustomGame extends React.Component {
  static propTypes = {
    onComplete: PropTypes.func.isRequired,
    onBackClicked: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.onAddPlayerClicked = this.onAddPlayerClicked.bind(this);
    this.onRemovePlayerClicked = this.onRemovePlayerClicked.bind(this);
    this.onPlayerNameChanged = this.onPlayerNameChanged.bind(this);
    this.onPlayerRoleSelected = this.onPlayerRoleSelected.bind(this);
    this.onDifficultySelected = this.onDifficultySelected.bind(this);
    this.onPlayButtonClicked = this.onPlayButtonClicked.bind(this);

    const storedState = localStorage.getItem(STORAGE_KEY);
    this.state = storedState ? JSON.parse(storedState) : {
      difficulty: 5,
      players: [{
        name: sample(NAMES),
        role: null // random
      }]
    };
  }

  onAddPlayerClicked() {
    const availableNames = NAMES.filter((name) =>
      !find(this.state.players, { name }));
    const name = sample(availableNames);
    this.setState({ players: [...this.state.players, { name, role: null }]});
  }

  onRemovePlayerClicked(index) {
    this.setState({ players: [
      ...this.state.players.slice(0, index),
      ...this.state.players.slice(index + 1)
    ]});
  }

  onPlayerNameChanged(event, index) {
    const name = event.target.value;
    this.setState({ players: this.state.players.map((pl, i) =>
      i === index ? { ...this.state.players[index], name } : pl
    )});
  }

  onPlayerRoleSelected(role, event, index) {
    this.setState({ players: this.state.players.map((pl, i) =>
      i === index ? { ...this.state.players[index], role } : pl
    )});
  }

  getAvailableRoles() {
    return difference(Object.keys(ROLES),
      this.state.players.map((pl) => pl.role));
  }

  onDifficultySelected(difficulty) {
    this.setState({ difficulty });
  }

  onPlayButtonClicked() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    this.props.onComplete(this.state.players, +this.state.difficulty);
  }

  render() {
    return (
      <div className="custom-game">
        <h2>Custom Game</h2>
        <h5>Your settings will be saved in the browser for future sessions.</h5>

        <div className="difficulty">
          <span>Difficulty Level:</span>
          <DropdownButton
            id="difficulty"
            title={DIFFICULTIES[this.state.difficulty]}
            onSelect={this.onDifficultySelected}>
            {map(DIFFICULTIES, (text, level) =>
              <MenuItem eventKey={level}>{text}</MenuItem>
            )}
          </DropdownButton>
        </div>
        <div className="player-container">
          {this.state.players.map((pl, i) =>
            <CustomGamePlayer
              key={i}
              name={pl.name}
              role={pl.role}
              roles={this.getAvailableRoles()}
              removeEnabled={this.state.players.length > 1}
              onNameChanged={partialRight(this.onPlayerNameChanged, i)}
              onRoleSelected={partialRight(this.onPlayerRoleSelected, i)}
              onRemoveClicked={partial(this.onRemovePlayerClicked, i)} />
          )}
        </div>

        <Button
          className={classnames(["add-player", { 'invisible': this.state.players.length === 5 }])}
          bsStyle="link"
          onClick={this.onAddPlayerClicked}>Add Player</Button>
        <div className="button-container">
          <Button
            bsStyle="primary"
            bsSize="large"
            onClick={this.onPlayButtonClicked}>Play</Button>
          <Button
            onClick={this.props.onBackClicked}
            bsStyle="link">Back</Button>
        </div>
      </div>
    );
  }
}
