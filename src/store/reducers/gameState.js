import { Cmd, liftState } from 'redux-loop';
import {
  pipe,
  always,
  evolve,
  append,
  ifElse,
  equals,
  take,
  curry,
  isEmpty,
  cond
} from 'ramda';
import { createReducer, run } from 'utils';
import { generateStep, runPlayback } from 'store/effects';
import {
  NEW_GAME,
  ADD_STEP,
  INPUT_SECTION,
  START_PLAYER_TURN,
  addStep,
  startPlayerTurn
} from 'store/actions';
import { STARTUP, PLAYBACK, PLAYER } from 'types';

const DEFAULT = {
  sequence: [],
  playerInput: [],
  phase: STARTUP
};

// isValidInput :: a -> { sequence :: [a], playerInput :: [a] } -> Boolean
const isValidInput = curry((x, { sequence, playerInput }) =>
  equals(take(playerInput.length + 1, sequence), append(x, playerInput))
);
// wasMistakeMade :: State -> Boolean
const wasMistakeMade = state => isEmpty(state.playerInput);
// isSequenceComplete :: State -> Boolean
const isSequenceComplete = state => equals(state.sequence, state.playerInput);
// otherwise :: () -> Boolean
const otherwise = always(true);

const schedulePlayback = run({
  cmd: runPlayback,
  onSuccess: startPlayerTurn,
  args: [Cmd.getState, Cmd.dispatch]
});

const reducer = createReducer(DEFAULT, {
  [NEW_GAME]: pipe(
    always(DEFAULT),
    run({ cmd: generateStep, onSuccess: addStep })
  ),
  [ADD_STEP]: pipe(
    (state, action) =>
      evolve(
        {
          sequence: append(action.payload),
          playerInput: always([]),
          phase: always(PLAYBACK)
        },
        state
      ),
    schedulePlayback
  ),
  [START_PLAYER_TURN]: evolve({ phase: always(PLAYER) }),
  [INPUT_SECTION]: pipe(
    (state, action) =>
      ifElse(
        isValidInput(action.payload),
        evolve({ playerInput: append(action.payload) }),
        evolve({ playerInput: always([]), phase: always(PLAYBACK) })
      )(state),
    cond([
      [wasMistakeMade, schedulePlayback],
      [isSequenceComplete, run({ cmd: generateStep, onSuccess: addStep })],
      [otherwise, x => x]
    ])
  )
});
export default pipe(reducer, liftState);
