import S from 'sanctuary-module';
import * as sut from './gameState';
import { Cmd, loop } from 'redux-loop';
import * as actions from 'store/actions';
import * as effects from 'store/effects';
import { TOP_LEFT, BOTTOM_RIGHT } from 'types';
import { PLAYBACK_VISIBLE, PLAYBACK_PAUSE } from 'invariants';

describe('reducer', () => {
  const subject = sut.default;

  it('NEW_GAME', () => {
    const state = 'blah';
    const action = actions.newGame();

    const result = subject(state, action);

    expect(result).toEqual(
      loop(
        {
          playback: S.Nothing,
          sequence: []
        },
        Cmd.run(effects.generateStep, { successActionCreator: actions.addStep })
      )
    );
  });

  it('ADD_STEP', () => {
    const state = {
      playback: S.Nothing,
      sequence: [TOP_LEFT]
    };
    const action = actions.addStep(BOTTOM_RIGHT);

    const result = subject(state, action);

    expect(result).toEqual(
      loop(
        {
          playback: S.Just({ index: 0, isVisible: true }),
          sequence: [TOP_LEFT, BOTTOM_RIGHT]
        },
        Cmd.run(effects.waitFor, {
          successActionCreator: actions.advancePlayback,
          args: [PLAYBACK_VISIBLE]
        })
      )
    );
  });

  describe('ADVANCE_PLAYBACK', () => {
    it('playback not running', () => {
      const state = { playback: S.Nothing, sequence: ['a', 'b', 'c'] };
      const action = actions.advancePlayback();

      const result = subject(state, action);

      expect(result).toEqual(loop(state, Cmd.none));
    });

    it('playback running, item visible', () => {
      const state = {
        playback: S.Just({ index: 1, isVisible: true }),
        sequence: ['a', 'b', 'c']
      };
      const action = actions.advancePlayback();

      const result = subject(state, action);

      expect(result).toEqual(
        loop(
          {
            playback: S.Just({ index: 2, isVisible: false }),
            sequence: ['a', 'b', 'c']
          },
          Cmd.run(effects.waitFor, {
            successActionCreator: actions.advancePlayback,
            args: [PLAYBACK_PAUSE]
          })
        )
      );
    });

    it('playback running, item not visible', () => {
      const state = {
        playback: S.Just({ index: 1, isVisible: false }),
        sequence: ['a', 'b', 'c']
      };
      const action = actions.advancePlayback();

      const result = subject(state, action);

      expect(result).toEqual(
        loop(
          {
            playback: S.Just({ index: 1, isVisible: true }),
            sequence: ['a', 'b', 'c']
          },
          Cmd.run(effects.waitFor, {
            successActionCreator: actions.advancePlayback,
            args: [PLAYBACK_VISIBLE]
          })
        )
      );
    });

    it('playback done', () => {
      const state = {
        playback: S.Just({ index: 2, isVisible: true }),
        sequence: ['a', 'b', 'c']
      };
      const action = actions.advancePlayback();

      const result = subject(state, action);

      expect(result).toEqual(
        loop(
          {
            playback: S.Just({ index: 3, isVisible: false }),
            sequence: ['a', 'b', 'c']
          },
          Cmd.run(effects.waitFor, {
            successActionCreator: actions.startPlayerTurn,
            args: [PLAYBACK_PAUSE]
          })
        )
      );
    });
  });
});

describe('getHighlightedSection', () => {
  const subject = sut.getHighlightedSection;

  it('no playback', () => {
    const state = { playback: S.Nothing, sequence: [] };

    const result = subject(state);

    expect(result).toBe(S.Nothing);
  });

  it('playback in progress, section visible', () => {
    const state = {
      playback: S.Just({ index: 1, isVisible: true }),
      sequence: ['a', 'b', 'c']
    };

    const result = subject(state);

    expect(result).toEqual(S.Just('b'));
  });

  it('playback in progress, section not visible', () => {
    const state = {
      playback: S.Just({ index: 1, isVisible: false }),
      sequence: ['a', 'b', 'c']
    };

    const result = subject(state);

    expect(result).toEqual(S.Nothing);
  });

  it('playback over', () => {
    const state = {
      playback: S.Just({ index: 3 }),
      sequence: ['a', 'b', 'c']
    };

    const result = subject(state);

    expect(result).toBe(S.Nothing);
  });
});
