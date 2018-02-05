import React from 'react';
import ReactSound from 'react-sound';
import { TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT } from 'types';
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

const Sound = ({ position }) => (
  <ReactSound
    url={soundUrls[position]}
    playStatus={ReactSound.status.PLAYING}
  />
);

export default Sound;
