import React from 'react';
import { Button, Panel } from 'react-bootstrap';
import { partial } from 'lodash';


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

export default DiseasePicker;
