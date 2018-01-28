import React from 'react';
import './SimonDisplay.css';

const SimonDisplay = ({ position, isHighlighted }) => (
  <div
    className={`simon-playback ${
      isHighlighted ? `${position}-highlighted` : position
    }`}
  />
);

export default SimonDisplay;
