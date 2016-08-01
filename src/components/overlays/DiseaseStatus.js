import React, { PropTypes } from 'react';

import DISEASES from '../../constants/diseases';


export default class DiseaseStatus extends React.Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    color: PropTypes.oneOf(DISEASES),
    onAnimationComplete: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { image } = this.refs;
    image.addEventListener('animationend', () => {
      setTimeout(this.props.onAnimationComplete, 500);
    });
  }

  render() {
    const { color, status } = this.props;

    return (
      <div className="overlay disease-status-overlay">
        <div className="banner">
          <div className="text">{status}</div>
        </div>
        <div
          ref="image"
          className={`disease-image disease-${color}`} />
      </div>
    );
  }
}
