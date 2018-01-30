import { equals } from 'ramda';
import { createReducer } from 'utils';
import { STARTUP, PLAYBACK, PLAYER } from 'types';
import { NEW_GAME, START_PLAYER_TURN } from 'store/actions';

export default createReducer(STARTUP, {
  [NEW_GAME]: () => PLAYBACK,
  [START_PLAYER_TURN]: () => PLAYER
});

export const isStartupPhase = equals(STARTUP);
export const isPlayerPhase = equals(PLAYER);
