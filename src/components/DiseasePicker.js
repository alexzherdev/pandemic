import React, { PropTypes } from 'react';
import { Button, Panel } from 'react-bootstrap';
import { partial } from 'lodash';

import { diseaseType } from '../constants/propTypes';


const DiseasePicker = ({ title, diseases, onDiseasePicked }) => {
  return (
    <Panel
      className="disease-picker"
      header={title}>
      {diseases.map((c) =>
        <Button
          id={`disease-picker-${c}`}
          key={c}
          onClick={partial(onDiseasePicked, c)}>
          <img className={`disease-${c}`} />
        </Button>
      )}
    </Panel>
  );
};

DiseasePicker.propTypes = {
  diseases: PropTypes.arrayOf(diseaseType.isRequired).isRequired,
  onDiseasePicked: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default DiseasePicker;
