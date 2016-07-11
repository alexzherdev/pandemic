import React from 'react';
import ReactDOM from 'react-dom';

import Card from './Card';


export default class CardWrapper extends React.Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    console.log(el);
    $(el).on('webkitAnimationStart animationstart', (e) => {
      this.props.onAnimationStart(this.props.cardType, this.props.id, e.originalEvent);
    });
  }

  render() {
    const { onAnimationStart, ...rest } = this.props; // eslint-disable-line no-unused-vars
    return <Card {...rest} />;
  }
}
