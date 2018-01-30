import S from 'sanctuary-module';
import { Cmd, liftState, loop } from 'redux-loop';
import { pipe, always, evolve, append, map, cond, T } from 'ramda';
import { PLAYBACK_VISIBLE, PLAYBACK_PAUSE } from 'invariants';
import { createReducer, run, runWith } from 'utils';
import { generateStep, waitFor } from 'store/effects';
import {
  NEW_GAME,
  ADD_STEP,
  ADVANCE_PLAYBACK,
  START_PLAYER_TURN,
  addStep,
  advancePlayback,
  startPlayerTurn
} from 'store/actions';

const DEFAULT = {
  playback: S.Nothing,
  sequence: []
};
const PLAYBACK_INITIAL = { index: 0, isVisible: true };

// isNoPlayback :: State -> Boolean
const isNoPlayback = ({ playback }) => S.isNothing(playback);

// getHighlightedSection :: State -> Maybe Position
const getPlaybackCurrent = ({ playback, sequence }) =>
  S.chain(({ index }) => S.at(index, sequence), playback);
// isPlaybackDone :: State -> Boolean
const isPlaybackDone = pipe(getPlaybackCurrent, S.isNothing);

// toNextState :: { index :: Int, isVisible :: Boolean } -> { index :: Int, isVisible :: Boolean }
const toNextState = ({ index, isVisible }) =>
  isVisible
    ? { index: index + 1, isVisible: false }
    : { index, isVisible: true };

// nextDelay :: Maybe { index :: Int, isVisible :: Boolean } -> Int
const nextDelay = S.maybe(
  0,
  ({ isVisible }) => (isVisible ? PLAYBACK_VISIBLE : PLAYBACK_PAUSE)
);

const reducer = createReducer(DEFAULT, {
  [NEW_GAME]: pipe(
    always(DEFAULT),
    run({ cmd: generateStep, onSuccess: addStep })
  ),
  [ADD_STEP]: pipe(
    (state, action) =>
      evolve(
        {
          playback: always(S.Just(PLAYBACK_INITIAL)),
          sequence: append(action.payload)
        },
        state
      ),
    run({ cmd: waitFor, onSuccess: advancePlayback, args: [PLAYBACK_VISIBLE] })
  ),
  [ADVANCE_PLAYBACK]: pipe(
    evolve({ playback: map(toNextState) }),
    cond([
      [isNoPlayback, state => loop(state, Cmd.none)],
      [
        isPlaybackDone,
        run({
          cmd: waitFor,
          onSuccess: startPlayerTurn,
          args: [PLAYBACK_PAUSE]
        })
      ],
      [
        T,
        runWith(state => ({
          cmd: waitFor,
          onSuccess: advancePlayback,
          args: [nextDelay(state.playback)]
        }))
      ]
    ])
  ),
  [START_PLAYER_TURN]: evolve({ playback: always(S.Nothing) })
});
export default pipe(reducer, liftState);
