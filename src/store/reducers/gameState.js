import { Cmd, liftState } from 'redux-loop';
import { pipe, evolve, append, curry, cond, assoc, ifElse } from 'ramda';
import { createReducer, run } from 'utils';
import {
  ADD_STEP,
  ADVANCE_PLAYBACK,
  INPUT_SECTION,
  addStep as addStepAction
} from 'store/actions';
import { runPlayback, generateStep } from 'store/effects';
import { Phase } from 'types';
import { MAX_SEQUENCE } from 'invariants';

const DEFAULT = {
  sequence: [],
  isStrict: false,
  phase: Phase.None
};
const PLAYBACK_INITIAL = Phase.PlaybackOf({ index: 0, isVisible: false });
const PLAYER_INITIAL = Phase.Player(0);

// startPlayback :: State -> (State, Cmd)
const startPlayback = run({
  cmd: runPlayback,
  args: [Cmd.getState, Cmd.dispatch]
});

//-----------------------------------------------------------------------------
// ADD STEP
//-----------------------------------------------------------------------------

// addStep :: (State, Action) -> (State, Cmd)
const addStep = pipe(
  (state, action) =>
    evolve(
      { sequence: append(action.payload), phase: () => PLAYBACK_INITIAL },
      state
    ),
  startPlayback
);

//-----------------------------------------------------------------------------
// ADVANCE PLAYBACK
//-----------------------------------------------------------------------------

// incrementPlaybackState :: Number -> Boolean -> PlaybackState
const incrementPlaybackState = (index, isVisible) =>
  isVisible
    ? { index: index + 1, isVisible: false }
    : { index, isVisible: true };
// checkPlaybackDone :: [Section] -> PlaybackState -> Phase
const checkPlaybackDone = curry(
  (sequence, state) =>
    state.index < sequence.length ? Phase.PlaybackOf(state) : PLAYER_INITIAL
);
// nextPlaybackStep :: [Section] -> Phase -> Phase
const nextPlaybackStep = curry((sequence, phase) =>
  Phase.case(
    {
      Playback: pipe(incrementPlaybackState, checkPlaybackDone(sequence)),
      _: () => phase
    },
    phase
  )
);
// advancePlayback :: (State, Action) -> (State, Cmd)
const advancePlayback = state =>
  pipe(evolve({ phase: nextPlaybackStep(state.sequence) }), liftState)(state);

//-----------------------------------------------------------------------------
// INPUT SECTION
//-----------------------------------------------------------------------------

// isCorrectInput :: Number -> [Section] -> Section -> Boolean
const isCorrectInput = (progress, sequence, input) =>
  sequence[progress] === input;

// updatePhase :: State -> State
const updatePhase = evolve({
  phase: phase =>
    Phase.case(
      {
        Player: progress => Phase.Player(progress + 1),
        _: () => phase
      },
      phase
    )
});

const GAME_COMPLETE = [
  // predicate :: State -> Boolean
  ({ phase }) =>
    Phase.case(
      {
        Player: nextProgress => nextProgress === MAX_SEQUENCE,
        _: () => false
      },
      phase
    ),
  // transformer :: State -> (State, Cmd)
  pipe(assoc('phase', Phase.None), liftState)
];
const SEQUENCE_COMPLETE = [
  // predicate :: State -> Boolean
  ({ phase, sequence }) =>
    Phase.case(
      {
        Player: nextProgress => nextProgress === sequence.length,
        _: () => false
      },
      phase
    ),
  // transformer :: State -> (State, Cmd)
  pipe(
    assoc('phase', Phase.None),
    run({ cmd: generateStep, onSuccess: addStepAction })
  )
];
const OTHERWISE = [
  // predicate :: State -> Boolean
  () => true,
  // transformer :: State -> (State, Cmd)
  liftState
];

// advanceProgress :: State -> (State, Cmd)
const advanceProgress = pipe(
  updatePhase,
  cond([GAME_COMPLETE, SEQUENCE_COMPLETE, OTHERWISE])
);

// isStrictMode :: State -> Boolean
const isStrictMode = ({ isStrict }) => isStrict;

// strictReset :: State -> (State, Cmd)
const strictReset = pipe(
  evolve({ sequence: () => [], phase: () => Phase.None }),
  run({ cmd: generateStep, onSuccess: addStepAction })
);

// softReset :: State -> (State, Cmd)
const softReset = pipe(assoc('phase', PLAYBACK_INITIAL), startPlayback);

// resetProgress :: State -> (State, Cmd)
const resetProgress = ifElse(isStrictMode, strictReset, softReset);

// updateProgress :: (State, Action) -> (State, Cmd)
const updateProgress = curry(
  (state, action, progress) =>
    isCorrectInput(progress, state.sequence, action.payload)
      ? advanceProgress(state)
      : resetProgress(state)
);

// inputSection :: (State, Action) -> (State, Cmd)
const inputSection = (state, action) =>
  Phase.case(
    {
      Player: updateProgress(state, action),
      _: () => liftState(state)
    },
    state.phase
  );

export default createReducer(DEFAULT, {
  [ADD_STEP]: addStep,
  [ADVANCE_PLAYBACK]: advancePlayback,
  [INPUT_SECTION]: inputSection
});
