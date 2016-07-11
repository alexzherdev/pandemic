import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Card from './Card';
import { cardProps } from '../constants/propTypes';


export default class CardWrapper extends React.Component {
  static propTypes = {
    ...cardProps,
    onAnimationStart: PropTypes.func.isRequired
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    $(el).on('webkitAnimationStart animationstart', (e) => {
      this.props.onAnimationStart(this.props.cardType, this.props.id, e.originalEvent);
    });
  }

  render() {
    const { onAnimationStart, ...rest } = this.props; // eslint-disable-line no-unused-vars
    return <Card {...rest} />;
  }
}
