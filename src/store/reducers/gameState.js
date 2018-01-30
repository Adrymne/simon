import { Cmd, liftState } from 'redux-loop';
import { pipe, always, evolve, append } from 'ramda';
import { createReducer, run } from 'utils';
import { generateStep, runPlayback } from 'store/effects';
import { NEW_GAME, ADD_STEP, addStep, startPlayerTurn } from 'store/actions';

const DEFAULT = {
  sequence: []
};

const reducer = createReducer(DEFAULT, {
  [NEW_GAME]: pipe(
    always(DEFAULT),
    run({ cmd: generateStep, onSuccess: addStep })
  ),
  [ADD_STEP]: pipe(
    (state, action) => evolve({ sequence: append(action.payload) }, state),
    run({
      cmd: runPlayback,
      onSuccess: startPlayerTurn,
      args: [Cmd.getState, Cmd.dispatch]
    })
  )
});
export default pipe(reducer, liftState);
