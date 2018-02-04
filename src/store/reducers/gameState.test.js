import * as sut from './gameState';
import { Cmd, loop } from 'redux-loop';
import * as R from 'ramda';
import * as actions from 'store/actions';
import * as effects from 'store/effects';
import * as types from 'types';
import * as invariants from 'invariants';

describe('reducer', () => {
  const subject = sut.default;

  it('ADD_STEP', () => {
    const state = { sequence: ['a'], isStrict: false, phase: types.Phase.None };
    const action = actions.addStep();

    const result = subject(state, action);

    expect(result).toEqual(
      loop(
        {
          sequence: ['a', action.payload],
          isStrict: state.isStrict,
          phase: types.Phase.PlaybackOf({ index: 0, isVisible: false })
        },
        Cmd.run(effects.runPlayback, { args: [Cmd.getState, Cmd.dispatch] })
      )
    );
  });

  describe('ADVANCE_PLAYBACK', () => {
    const action = actions.advancePlayback();

    it('not playback phase', () => {
      const state = { phase: types.Phase.Player(3) };

      const result = subject(state, action);

      expect(result).toEqual(loop(state, Cmd.none));
    });

    it('section not highlighted', () => {
      const state = {
        sequence: ['a', 'b', 'c'],
        phase: types.Phase.PlaybackOf({ index: 1, isVisible: false })
      };

      const result = subject(state, action);

      const expected = R.assoc(
        'phase',
        types.Phase.PlaybackOf({ index: 1, isVisible: true }),
        state
      );
      expect(result).toEqual(loop(expected, Cmd.none));
    });

    it('section highlighted', () => {
      const state = {
        sequence: ['a', 'b', 'c'],
        phase: types.Phase.PlaybackOf({ index: 1, isVisible: true })
      };

      const result = subject(state, action);

      const expected = R.assoc(
        'phase',
        types.Phase.PlaybackOf({ index: 2, isVisible: false }),
        state
      );
      expect(result).toEqual(loop(expected, Cmd.none));
    });

    it('end playback', () => {
      const state = {
        sequence: ['a', 'b', 'c'],
        phase: types.Phase.PlaybackOf({ index: 2, isVisible: true })
      };

      const result = subject(state, action);

      const expected = R.assoc('phase', types.Phase.Player(0), state);
      expect(result).toEqual(loop(expected, Cmd.none));
    });
  });

  describe('INPUT_SECTION', () => {
    it('not player phase', () => {
      const state = {
        sequence: ['a', 'b', 'c'],
        phase: types.Phase.PlaybackOf({ index: 1, isVisible: false })
      };
      const action = actions.inputSection('a');

      const result = subject(state, action);

      expect(result).toEqual(loop(state, Cmd.none));
    });

    it('correct input, sequence incomplete', () => {
      const state = {
        sequence: ['a', 'b', 'c'],
        phase: types.Phase.Player(1)
      };
      const action = actions.inputSection('b');

      const result = subject(state, action);

      const expected = R.assoc('phase', types.Phase.Player(2), state);
      expect(result).toEqual(loop(expected, Cmd.none));
    });

    it('correct input, sequence complete', () => {
      const state = {
        sequence: ['a', 'b', 'c'],
        phase: types.Phase.Player(2)
      };
      const action = actions.inputSection('c');

      const result = subject(state, action);

      const expected = R.assoc('phase', types.Phase.Player(3), state);
      expect(result).toEqual(
        loop(
          expected,
          Cmd.run(effects.generateStep, {
            successActionCreator: actions.addStep
          })
        )
      );
    });

    it('correct input, game complete', () => {
      const state = {
        sequence: new Array(invariants.MAX_SEQUENCE).fill('a'),
        phase: types.Phase.Player(invariants.MAX_SEQUENCE - 1)
      };
      const action = actions.inputSection('a');

      const result = subject(state, action);

      const expected = R.assoc('phase', types.Phase.None, state);
      expect(result).toEqual(loop(expected, Cmd.none));
    });

    it('bad input, non-strict', () => {
      const state = {
        sequence: ['a', 'b', 'c'],
        phase: types.Phase.Player(1),
        isStrict: false
      };
      const action = actions.inputSection('a');

      const result = subject(state, action);

      expect(result).toEqual(
        loop(
          R.assoc(
            'phase',
            types.Phase.PlaybackOf({ index: 0, isVisible: false }),
            state
          ),
          Cmd.run(effects.runPlayback, { args: [Cmd.getState, Cmd.dispatch] })
        )
      );
    });

    it('bad input, strict mode', () => {
      const state = {
        sequence: ['a', 'b', 'c'],
        phase: types.Phase.Player(1),
        isStrict: true
      };
      const action = actions.inputSection('a');

      const result = subject(state, action);

      expect(result).toEqual(
        loop(
          { sequence: [], phase: state.phase, isStrict: state.isStrict },
          Cmd.run(effects.generateStep, {
            successActionCreator: actions.addStep
          })
        )
      );
    });
  });
});
