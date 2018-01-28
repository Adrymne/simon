import S from 'sanctuary-module';
import * as sut from './gameState';
import { Cmd, loop } from 'redux-loop';
import * as actions from 'store/actions';
import * as effects from 'store/effects';
import { TOP_LEFT, BOTTOM_RIGHT } from 'types';

describe('reducer', () => {
  const subject = sut.default;

  it('NEW_GAME', () => {
    const state = 'blah';
    const action = actions.newGame();

    const result = subject(state, action);

    expect(result).toEqual(
      loop(
        {
          playbackIndex: S.Nothing,
          currentSequence: [],
          playerInput: []
        },
        Cmd.run(effects.generateStep, { successActionCreator: actions.addStep })
      )
    );
  });

  it('ADD_STEP', () => {
    const state = {
      playbackIndex: S.Nothing,
      currentSequence: [TOP_LEFT],
      playerInput: []
    };
    const action = actions.addStep(BOTTOM_RIGHT);

    const result = subject(state, action);

    expect(result).toEqual(
      loop(
        {
          playbackIndex: S.Just(0),
          currentSequence: [TOP_LEFT, BOTTOM_RIGHT],
          playerInput: []
        },
        Cmd.run(effects.runPlayback, {
          successActionCreator: actions.startPlayerTurn,
          args: [Cmd.getState, Cmd.dispatch]
        })
      )
    );
  });

  it('ADVANCE_PLAYBACK', () => {
    const state = {
      playbackIndex: S.Just(0),
      currentSequence: [TOP_LEFT, BOTTOM_RIGHT],
      playerInput: []
    };
    const action = actions.advancePlayback();

    const result = subject(state, action);

    expect(result).toEqual(
      loop(
        {
          playbackIndex: S.Just(1),
          currentSequence: [TOP_LEFT, BOTTOM_RIGHT],
          playerInput: []
        },
        Cmd.none
      )
    );
  });
});

describe('getHighlightedSection', () => {
  const subject = sut.getHighlightedSection;

  it('no playback', () => {
    const state = { playbackIndex: S.Nothing, currentSequence: [] };

    const result = subject(state);

    expect(result).toBe(S.Nothing);
  });

  it('playback in progress', () => {
    const state = { playbackIndex: S.Just(1), currentSequence: [1, 2, 3] };

    const result = subject(state);

    expect(result).toEqual(S.Just(2));
  });

  it('playback over', () => {
    const state = { playbackIndex: S.Just(3), currentSequence: [1, 2, 3] };

    const result = subject(state);

    expect(result).toBe(S.Nothing);
  });
});

describe('isPlaybackDone', () => {
  const subject = sut.isPlaybackDone;

  it('no playback', () => {
    const state = { playbackIndex: S.Nothing, currentSequence: [] };

    const result = subject(state);

    expect(result).toBe(true);
  });

  it('playback in progress', () => {
    const state = { playbackIndex: S.Just(1), currentSequence: [1, 2, 3] };

    const result = subject(state);

    expect(result).toBe(false);
  });

  it('playback finished', () => {
    const state = { playbackIndex: S.Just(3), currentSequence: [1, 2, 3] };

    const result = subject(state);

    expect(result).toBe(true);
  });
});
