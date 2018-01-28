import subject from './gameState';
import { Cmd, loop } from 'redux-loop';
import * as actions from 'store/actions';
import * as effects from 'store/effects';
import { TOP_LEFT, BOTTOM_RIGHT } from 'types';

it('NEW_GAME', () => {
  const state = 'blah';
  const action = actions.newGame();

  const result = subject(state, action);

  expect(result).toEqual(
    loop(
      {
        currentSequence: [],
        playerInput: []
      },
      Cmd.run(effects.generateStep, { successActionCreator: actions.addStep })
    )
  );
});

it('ADD_STEP', () => {
  const state = {
    currentSequence: [TOP_LEFT],
    playerInput: []
  };
  const action = actions.addStep(BOTTOM_RIGHT);

  const result = subject(state, action);

  expect(result).toEqual(
    loop(
      {
        currentSequence: [TOP_LEFT, BOTTOM_RIGHT],
        playerInput: []
      },
      Cmd.run(effects.playSequence, {
        successActionCreator: actions.startPlayerTurn,
        args: [Cmd.dispatch, [TOP_LEFT, BOTTOM_RIGHT]]
      })
    )
  );
});
