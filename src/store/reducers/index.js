import { combineReducers } from 'redux-loop';
import appMode from './appMode';
import gameState from './gameState';

export default combineReducers({ gameState, appMode });
