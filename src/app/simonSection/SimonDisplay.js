import React from 'react';
import Sound from 'react-sound';
import { TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT } from 'types';
import './SimonDisplay.css';
import topLeftSound from './top-left.mp3';
import topRightSound from './top-right.mp3';
import bottomLeftSound from './bottom-left.mp3';
import bottomRightSound from './bottom-right.mp3';

const soundUrls = {
  [TOP_LEFT]: topLeftSound,
  [TOP_RIGHT]: topRightSound,
  [BOTTOM_LEFT]: bottomLeftSound,
  [BOTTOM_RIGHT]: bottomRightSound
};

const soundPlayer = position => (
  <Sound url={soundUrls[position]} playStatus={Sound.status.PLAYING} />
);

const SimonDisplay = ({ position, isHighlighted }) => (
  <React.Fragment>
    <div
      className={`simon-playback ${
        isHighlighted ? `${position}-highlighted` : position
      }`}
    />
    {isHighlighted ? soundPlayer(position) : ''}
  </React.Fragment>
);

export default SimonDisplay;
