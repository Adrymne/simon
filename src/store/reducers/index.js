import { combineReducers } from 'redux-loop';
import appMode from './appMode';
import gameState from './gameState';
import playbackState from './playback';

export default combineReducers({ gameState, appMode, playbackState });
