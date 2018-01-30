import * as sut from './gameState';
import { Cmd, loop } from 'redux-loop';
import * as actions from 'store/actions';
import * as effects from 'store/effects';

describe('reducer', () => {
  const subject = sut.default;

  it('NEW_GAME', () => {
    const state = 'blah';
    const action = actions.newGame();

    const result = subject(state, action);

    expect(result).toEqual(
      loop(
        { sequence: [] },
        Cmd.run(effects.generateStep, { successActionCreator: actions.addStep })
      )
    );
  });

  it('ADD_STEP', () => {
    const state = { sequence: ['a'] };
    const action = actions.addStep('b');

    const result = subject(state, action);

    expect(result).toEqual(
      loop(
        { sequence: ['a', 'b'] },
        Cmd.run(effects.runPlayback, {
          successActionCreator: actions.startPlayerTurn,
          args: [Cmd.getState, Cmd.dispatch]
        })
      )
    );
  });
});
