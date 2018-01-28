import { prop, pipe } from 'ramda';
import { combineReducers } from 'redux-loop';
import appMode, * as appModeSelectors from './appMode';
import gameState, * as gameSelectors from './gameState';

export default combineReducers({ gameState, appMode });

export const isStartupPhase = pipe(
  prop('appMode'),
  appModeSelectors.isStartupPhase
);
export const isPlayerPhase = pipe(
  prop('appMode'),
  appModeSelectors.isPlayerPhase
);
export const getHighlightedSection = pipe(
  prop('gameState'),
  gameSelectors.getHighlightedSection
);
export const isPlaybackDone = pipe(
  prop('gameState'),
  gameSelectors.isPlaybackDone
);
