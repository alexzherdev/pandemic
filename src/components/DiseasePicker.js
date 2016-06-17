import React from 'react';
import { Button, Panel } from 'react-bootstrap';
import { partial } from 'lodash';


const DiseasePicker = ({ diseases, onDiseasePicked }) => {
  return (
    <Panel className="disease-picker">
      {diseases.map((c) =>
        <Button
          id={`disease-picker-${c}`}
          key={c}
          onClick={partial(onDiseasePicked, c)}>
          {c}
        </Button>
      )}
    </Panel>
  );
};

export default DiseasePicker;
