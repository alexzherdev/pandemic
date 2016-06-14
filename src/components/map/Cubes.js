import React from 'react';
import ReactDOM from 'react-dom';
import { values, pick, isEqual } from 'lodash';


const diseases = ['red', 'yellow', 'blue', 'black'];

export default class Cubes extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(pick(nextProps.location, diseases), pick(this.props.location, diseases));
  }

  componentDidUpdate() {
    const $el = $(ReactDOM.findDOMNode(this));
    const $cubes = $el.find('.cube');
    $cubes.removeClass('cube');
    $cubes.outerHeight();
    $cubes.addClass('cube');
  }

  render() {
    const cubes = [];
    const { location } = this.props;

    const counts = values(pick(location, diseases));
    const maxCount = Math.max(...counts);
    const totalCubes = counts.reduce(function(sum, c) { return sum + c; }, 0);
    let cubesSoFar = 0;
    diseases.forEach((c) => {
      for (let i = 0; i < location[c]; i++, cubesSoFar++) {
        cubes.push(
          <span
            key={`cube-${location.coords.join('')}-${c}-${i}`}
            className={`cube cubes-${maxCount} cube-${location[c]}-${i+1} ${c}`}
            style={{WebkitAnimationDelay: `-${cubesSoFar / totalCubes * (-maxCount * 3 + 12)}s`}}/>);
      }
    });
    return (
      <div>
        {maxCount === 3 &&
          <span className="outbreak-warning" />
        }
        {cubes}
      </div>
    );
  }
}
