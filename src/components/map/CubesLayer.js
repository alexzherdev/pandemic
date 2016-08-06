import React, { PropTypes } from 'react';
import { forOwn, isEmpty, isEqual, pick } from 'lodash';

import Cubes from './Cubes';
import { splitPath, getLength, constrainCubeMovement } from '../../utils';
import { locationType, diseaseType, viewCoordsType } from '../../constants/propTypes';


const INFECTING_CUBE_SPEED = 8;

export default class CubesLayer extends React.Component {
  static propTypes = {
    locations: PropTypes.objectOf(locationType.isRequired).isRequired,
    infectNeighborCallback: PropTypes.func.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    infectingCube: PropTypes.shape({
      origin: viewCoordsType.isRequired,
      destination: viewCoordsType.isRequired,
      color: diseaseType.isRequired
    })
  }

  shouldComponentUpdate(nextProps) {
    return !isEqual(
      pick(nextProps, ['locations', 'infectingCube']),
      pick(this.props, ['locations', 'infectingCube']))
      || nextProps.width !== this.props.width
      || nextProps.height !== this.props.height;
  }

  componentDidUpdate() {
    const { infectingCube } = this.props;
    if (!isEmpty(infectingCube)) {
      this.transitionNeighborInfection();
    }
  }

  animateMovement(cubeEl, [x1, y1], [x2, y2], length) {
    return cubeEl.animate([
      { left: `${x1}px`, top: `${y1}px`, offset: 0 },
      { left: `${x2}px`, top: `${y2}px`, offset: 1 }
    ], {
      duration: length * INFECTING_CUBE_SPEED,
      fill: 'forwards'
    });
  }

  transitionNeighborInfection() {
    const { origin, destination } = this.props.infectingCube;
    const cubeEl = document.getElementById('infect-neighbor-cube');
    const split = splitPath([origin.left, origin.top], [destination.left, destination.top], this.props.width);
    const length = isEmpty(split)
      ? getLength([origin.left, origin.top], [destination.left, destination.top])
      : getLength(...split[0]) + getLength(...split[1]);

    let anim;
    const $cube = $(cubeEl);
    const onfinish = () => {
      $cube.removeClass('cube-neighbor');
      $cube.on('animationend', (e) => {
        this.props.infectNeighborCallback();
        if (e.originalEvent.animationName === 'cube-flash') {
          $cube.removeClass('cube-flash');
        }
      });
      $cube.addClass('cube-flash');
    };

    if (isEmpty(split)) {
      anim = this.animateMovement(cubeEl, [origin.left, origin.top], [destination.left, destination.top], length);
      anim.onfinish = onfinish;
    } else {
      const trueSplit1 = [split[0][0], constrainCubeMovement(...split[0], this.props.width)];
      const length1 = getLength(...trueSplit1);
      anim = this.animateMovement(cubeEl, ...trueSplit1, length1);
      anim.onfinish = () => {
        const trueSplit2 = [constrainCubeMovement(...split[1].slice().reverse(), this.props.width), split[1][1]];
        const length2 = getLength(...trueSplit2);
        const secondAnim = this.animateMovement(cubeEl, ...trueSplit2, length2);
        secondAnim.onfinish = onfinish;
      };
    }
  }

  render() {
    const { locations, infectingCube, width, height } = this.props;
    const cubes = [];

    forOwn(locations, (loc, id) => {
      cubes.push(
        <Cubes
          key={id}
          location={loc}
          width={width}
          height={height} />
      );
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
