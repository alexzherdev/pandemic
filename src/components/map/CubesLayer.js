import React from 'react';
import { forOwn, isEmpty, isEqual, pick } from 'lodash';

import Cubes from './Cubes';


const INFECTING_CUBE_SPEED = 12;

export default class CubesLayer extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(
      pick(nextProps, ['locations', 'infectingCube']),
      pick(this.props, ['locations', 'infectingCube']));
  }

  componentDidUpdate() {
    const { infectingCube } = this.props;
    if (!isEmpty(infectingCube)) {
      this.transitionNeighborInfection();
    }
  }

  transitionNeighborInfection() {
    const { origin, destination } = this.props.infectingCube;
    const cubeEl = document.getElementById('infect-neighbor-cube');
    const length = Math.sqrt(
      (destination.left - origin.left) * (destination.left - origin.left) +
      (destination.top - origin.top) * (destination.top - origin.top)
    );
    const anim = cubeEl.animate([
      { left: `${origin.left}px`, top: `${origin.top}px`, offset: 0 },
      { left: `${destination.left}px`, top: `${destination.top}px`, offset: 1 }
    ], {
      duration: length * INFECTING_CUBE_SPEED,
      fill: 'forwards'
    });
    const $cube = $(cubeEl);
    anim.onfinish = () => {
      $cube.removeClass('cube-neighbor');
      $cube.on('animationend', (e) => {
        this.props.infectNeighborCallback();
        if (e.originalEvent.animationName === 'cube-flash') {
          $cube.removeClass('cube-flash');
        }
      });
      $cube.addClass('cube-flash');
    };
  }

  render() {
    const { locations, infectingCube } = this.props;
    const cubes = [];

    forOwn(locations, (loc, id) => {
      cubes.push(<Cubes key={id} location={loc} />);
    });
    if (!isEmpty(infectingCube)) {
      cubes.push(
        <div
          key="infect-neighbor-cube"
          id="infect-neighbor-cube"
          className={`cube ${infectingCube.color} cube-neighbor`} />
      );
    }
    return (
      <div>
        {cubes}
      </div>
    );
  }
}
