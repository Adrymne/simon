import S from 'sanctuary-module';
import { pipe, always, evolve, append, inc, map } from 'ramda';
import { Cmd, liftState } from 'redux-loop';
import { createReducer, run } from 'utils';
import { generateStep, runPlayback } from 'store/effects';
import {
  NEW_GAME,
  ADD_STEP,
  ADVANCE_PLAYBACK,
  addStep,
  startPlayerTurn
} from 'store/actions';

const DEFAULT = {
  playbackIndex: S.Nothing,
  currentSequence: [],
  playerInput: []
};

const reducer = createReducer(DEFAULT, {
  [NEW_GAME]: pipe(
    always(DEFAULT),
    run({ cmd: generateStep, onSuccess: addStep })
  ),
  [ADD_STEP]: pipe(
    (state, action) =>
      evolve(
        {
          playbackIndex: always(S.Just(0)),
          currentSequence: append(action.payload)
        },
        state
      ),
    run({
      cmd: runPlayback,
      onSuccess: startPlayerTurn,
      args: [Cmd.getState, Cmd.dispatch]
    })
  ),
  [ADVANCE_PLAYBACK]: evolve({ playbackIndex: map(inc) })
});
export default pipe(reducer, liftState);

// getHighlightedSection :: State -> Maybe Position
export const getHighlightedSection = ({ playbackIndex, currentSequence }) =>
  S.chain(S.at(S.__, currentSequence), playbackIndex);
// isPlaybackDone :: State -> Boolean
export const isPlaybackDone = S.pipe([getHighlightedSection, S.isNothing]);
