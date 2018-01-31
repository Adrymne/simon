import { combineReducers } from 'redux-loop';
import gameState from './gameState';
import playbackState from './playback';

export default combineReducers({ gameState, playbackState });
