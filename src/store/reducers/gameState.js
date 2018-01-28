import { pipe, always, evolve, append } from 'ramda';
import { Cmd } from 'redux-loop';
import { createReducer, run, runWith } from 'utils';
import { generateStep, playSequence } from 'store/effects';
import { NEW_GAME, ADD_STEP, addStep, startPlayerTurn } from 'store/actions';

const DEFAULT = {
  currentSequence: [],
  playerInput: []
};

export default createReducer(DEFAULT, {
  [NEW_GAME]: pipe(
    always(DEFAULT),
    run({ cmd: generateStep, onSuccess: addStep })
  ),
  [ADD_STEP]: pipe(
    (state, action) =>
      evolve({ currentSequence: append(action.payload) }, state),
    runWith(state => ({
      cmd: playSequence,
      onSuccess: startPlayerTurn,
      args: [Cmd.dispatch, state.currentSequence]
    }))
  )
});
