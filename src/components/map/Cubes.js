import React from 'react';
import ReactDOM from 'react-dom';
import { values, pick, isEqual } from 'lodash';

import { getCubeOrigin } from '../../utils';
import DISEASES from '../../constants/diseases';

export default class Cubes extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(pick(nextProps.location, DISEASES), pick(this.props.location, DISEASES));
  }

  componentDidUpdate() {
    const $el = $(ReactDOM.findDOMNode(this));
    const $cubes = $el.find('.cube');
    $cubes.removeClass('cube');
    $cubes.outerHeight();
    $cubes.addClass('cube');
  }

  render() {
    const { location } = this.props;
    const counts = values(pick(location, DISEASES));
    const maxCount = Math.max(...counts);
    const totalCubes = counts.reduce(function(sum, c) { return sum + c; }, 0);
    let cubesSoFar = 0;
    const cubes = [];
    DISEASES.forEach((c) => {
      for (let i = 0; i < location[c]; i++, cubesSoFar++) {
        cubes.push(
          <div
            key={`cube-${location.coords.join('')}-${c}-${i}`}
            className={`cube cubes-${maxCount} cube-${location[c]}-${i+1} ${c}`}
            style={{
              WebkitAnimationDelay: `-${cubesSoFar / totalCubes * (-maxCount * 3 + 12)}s`
            }} />
        );
      }
    });
    return (
      <div className="cube-group" style={getCubeOrigin(location)}>
        {cubes}
      </div>
    );
  }
}
