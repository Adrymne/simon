import { combineReducers } from 'redux-loop';
import gameState from './gameState';
import lastInput from './lastInput';

export default combineReducers({ gameState, lastInput });
