import { prop, pipe } from 'ramda';
import { combineReducers } from 'redux-loop';
import appMode, * as appModeSelectors from './appMode';
import gameState from './gameState';
import playbackState, * as playbackSelectors from './playbackState';

// appMode =  Startup | Playback | PlayerInput
// gameState = currentSequence playerInput maxSequenceLength
// isStrict = True | False

export default combineReducers({ gameState, appMode, playbackState });

export const isStartupPhase = pipe(
  prop('appMode'),
  appModeSelectors.isStartupPhase
);
export const isPlayerPhase = pipe(
  prop('appMode'),
  appModeSelectors.isPlayerPhase
);
export const getHighlightedSection = pipe(
  prop('playbackState'),
  playbackSelectors.getHighlightedSection
);
