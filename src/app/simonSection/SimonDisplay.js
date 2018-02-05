import React from 'react';
import Sound from 'components/Sound';
import './SimonDisplay.css';

const SimonDisplay = ({ position, isHighlighted }) => (
  <React.Fragment>
    <div
      className={`simon-playback ${
        isHighlighted ? `${position}-highlighted` : position
      }`}
    />
    {isHighlighted ? <Sound position={position} /> : ''}
  </React.Fragment>
);

export default SimonDisplay;
