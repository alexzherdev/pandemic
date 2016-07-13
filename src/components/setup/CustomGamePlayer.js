import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Button, DropdownButton, FormControl, MenuItem, Well } from 'react-bootstrap';

import ROLES from '../../constants/roles';


export default class CustomGamePlayer extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    role: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    removeEnabled: PropTypes.bool.isRequired,
    onNameChanged: PropTypes.func.isRequired,
    onRoleSelected: PropTypes.func.isRequired,
    onRemoveClicked: PropTypes.func.isRequired
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this.refs.input);
    node.select();
    node.focus();
  }

  render() {
    const { name, role, roles, removeEnabled, onNameChanged, onRoleSelected, onRemoveClicked } = this.props;
    return (
      <Well className="player">
        <FormControl
          ref="input"
          type="text"
          value={name}
          onChange={onNameChanged} />
        <DropdownButton
          id="player-role"
          title={role ? ROLES[role].name : 'Random'}
          onSelect={onRoleSelected}>
          <MenuItem eventKey="">Random</MenuItem>
          {roles.reduce((acc, id) => {
            acc.push(<MenuItem key={id} eventKey={id}>{ROLES[id].name}</MenuItem>);
            return acc;
          }, [])}
        </DropdownButton>
        <div className="spacer" />
        {removeEnabled &&
          <Button
            bsStyle="link"
            onClick={onRemoveClicked}>Remove</Button>
        }
      </Well>
    );
  }
}
