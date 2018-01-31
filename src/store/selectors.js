import { pathEq } from 'ramda';
import S from 'sanctuary-module';
import { STARTUP, PLAYER } from 'types';
import { PLAYBACK_SHOW_TIME, PLAYBACK_PAUSE_TIME } from 'invariants';

/*
State = {
  gameState: {
    phase :: Startup | Playback | Player
    sequence :: [Section],
    playerInput :: [Section]
  },
  playbackState: Maybe {
    index :: Int,
    isVisible :: Boolean
  }
}
*/

// isStartupPhase :: State -> Boolean
export const isStartupPhase = pathEq(['gameState', 'phase'], STARTUP);
// isPlayerPhase :: State -> Boolean
export const isPlayerPhase = pathEq(['gameState', 'phase'], PLAYER);

// getHighlightedSection :: State -> Maybe Section
export const getHighlightedSection = ({
  gameState: { sequence },
  playbackState
}) =>
  S.chain(
    ({ isVisible, index }) => (isVisible ? S.at(index, sequence) : S.Nothing),
    playbackState
  );

// getNextPlaybackDelay :: State -> Int
export const getNextPlaybackDelay = ({ playbackState }) =>
  S.maybe(
    0,
    ({ isVisible }) => (isVisible ? PLAYBACK_SHOW_TIME : PLAYBACK_PAUSE_TIME),
    playbackState
  );

// isPlaybackDone :: State -> Boolean
export const isPlaybackDone = ({ gameState: { sequence }, playbackState }) =>
  S.pipe(
    [S.chain(({ index }) => S.at(index, sequence)), S.isNothing],
    playbackState
  );
