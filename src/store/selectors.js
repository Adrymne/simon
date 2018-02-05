import { pathSatisfies } from 'ramda';
import S from 'sanctuary-module';
import { Phase } from 'types';
import {
  PLAYBACK_SHOW_TIME,
  PLAYBACK_PAUSE_TIME,
  MAX_SEQUENCE
} from 'invariants';

/*
Section = TopLeft | TopRight | BottomLeft | BottomRight

PlaybackState = {
  index :: Int,
  isVisible :: Boolean
}
TargetIndex = Int

GameState = {
    phase :: None | Playback PlaybackState | Player TargetIndex
    sequence :: [Section],
    isStrict :: Boolean
  }
}

State = {
  gameState :: GameState,
  lastPosition :: Maybe Section
}
*/

// isStartupPhase :: State -> Boolean
export const isStartupPhase = pathSatisfies(
  Phase.case({ None: () => true, _: () => false }),
  ['gameState', 'phase']
);
// isPlaybackPhase :: State -> Boolean
export const isPlaybackPhase = pathSatisfies(
  Phase.case({ Playback: () => true, _: () => false }),
  ['gameState', 'phase']
);
// isPlayerPhase :: State -> Boolean
export const isPlayerPhase = pathSatisfies(
  Phase.case({ Player: () => true, _: () => false }),
  ['gameState', 'phase']
);

// getLastPosition :: State -> Maybe Section
export const getLastPosition = state => state.lastInput;

// isStrictMode :: State -> Boolean
export const isStrictMode = state => state.gameState.isStrict;

// isGameOver :: State -> Boolean
export const isGameOver = state =>
  Phase.case(
    {
      None: () => state.gameState.sequence.length === MAX_SEQUENCE,
      _: () => false
    },
    state.gameState.phase
  );

// getCurrentStep :: State -> Number
export const getCurrentStep = state =>
  Phase.case(
    {
      Player: progress => progress,
      _: () => 0
    },
    state.gameState.phase
  );

// getCurrentSequenceLength :: State -> Number
export const getCurrentSequenceLength = state =>
  state.gameState.sequence.length;

// getHighlightedSection :: State -> Maybe Section
export const getHighlightedSection = ({ gameState: { sequence, phase } }) =>
  Phase.case(
    {
      Playback: (index, isVisible) =>
        isVisible ? S.at(index, sequence) : S.Nothing,
      _: () => S.Nothing
    },
    phase
  );

// getNextPlaybackDelay :: State -> Int
export const getNextPlaybackDelay = ({ gameState: { phase } }) =>
  Phase.case(
    {
      Playback: (_, isVisible) =>
        isVisible ? PLAYBACK_SHOW_TIME : PLAYBACK_PAUSE_TIME,
      _: () => 0
    },
    phase
  );
