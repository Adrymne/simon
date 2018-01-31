import * as sut from './gameState';
import { Cmd, loop } from 'redux-loop';
import * as actions from 'store/actions';
import * as effects from 'store/effects';
import * as types from 'types';

describe('reducer', () => {
  const subject = sut.default;

  it('NEW_GAME', () => {
    const state = 'blah';
    const action = actions.newGame();

    const result = subject(state, action);

    expect(result).toEqual(
      loop(
        { sequence: [], playerInput: [], phase: types.STARTUP },
        Cmd.run(effects.generateStep, { successActionCreator: actions.addStep })
      )
    );
  });

  it('ADD_STEP', () => {
    const state = { sequence: ['a'], playerInput: 'blah', phase: 'blah' };
    const action = actions.addStep('b');

    const result = subject(state, action);

    expect(result).toEqual(
      loop(
        { sequence: ['a', 'b'], playerInput: [], phase: types.PLAYBACK },
        Cmd.run(effects.runPlayback, {
          successActionCreator: actions.startPlayerTurn,
          args: [Cmd.getState, Cmd.dispatch]
        })
      )
    );
  });

  it('START_PLAYER_TURN', () => {
    const state = {
      sequence: ['a', 'b', 'c'],
      playerInput: [],
      phase: types.PLAYBACK
    };
    const action = actions.startPlayerTurn();

    const result = subject(state, action);

    expect(result).toEqual(
      loop(
        {
          sequence: ['a', 'b', 'c'],
          playerInput: [],
          phase: types.PLAYER
        },
        Cmd.none
      )
    );
  });

  describe('INPUT_SECTION', () => {
    it('correct input, sequence incompelte', () => {
      const state = {
        sequence: ['a', 'b', 'c'],
        playerInput: ['a'],
        phase: types.PLAYER
      };
      const action = actions.inputSection('b');

      const result = subject(state, action);

      expect(result).toEqual(
        loop(
          {
            sequence: ['a', 'b', 'c'],
            playerInput: ['a', 'b'],
            phase: types.PLAYER
          },
          Cmd.none
        )
      );
    });

    it('correct input, full sequence matched', () => {
      const state = {
        sequence: ['a', 'b', 'c'],
        playerInput: ['a', 'b'],
        phase: types.PLAYER
      };
      const action = actions.inputSection('c');

      const result = subject(state, action);

      expect(result).toEqual(
        loop(
          {
            sequence: ['a', 'b', 'c'],
            playerInput: ['a', 'b', 'c'],
            phase: types.PLAYER
          },
          Cmd.run(effects.generateStep, {
            successActionCreator: actions.addStep
          })
        )
      );
    });

    it('mismatch, non-strict', () => {
      const state = {
        sequence: ['a', 'b', 'c'],
        playerInput: ['a'],
        phase: types.PLAYER
      };
      const action = actions.inputSection('banana');

      const result = subject(state, action);

      expect(result).toEqual(
        loop(
          { sequence: ['a', 'b', 'c'], playerInput: [], phase: types.PLAYBACK },
          Cmd.run(effects.runPlayback, {
            successActionCreator: actions.startPlayerTurn,
            args: [Cmd.getState, Cmd.dispatch]
          })
        )
      );
    });
  });
});
