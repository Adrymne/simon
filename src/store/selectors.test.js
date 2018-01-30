import S from 'sanctuary-module';
import * as sut from './selectors';
import { PLAYBACK_SHOW_TIME, PLAYBACK_PAUSE_TIME } from 'invariants';

describe('getHighlightedSection', () => {
  const subject = sut.getHighlightedSection;

  it('no playback', () => {
    const state = { gameState: { sequence: [] }, playbackState: S.Nothing };

    const result = subject(state);

    expect(result).toBe(S.Nothing);
  });

  it('playback in progress, section visible', () => {
    const state = {
      gameState: {
        sequence: ['a', 'b', 'c']
      },
      playbackState: S.Just({ index: 1, isVisible: true })
    };

    const result = subject(state);

    expect(result).toEqual(S.Just('b'));
  });

  it('playback in progress, section not visible', () => {
    const state = {
      gameState: {
        sequence: ['a', 'b', 'c']
      },
      playbackState: S.Just({ index: 1, isVisible: false })
    };

    const result = subject(state);

    expect(result).toEqual(S.Nothing);
  });

  it('playback over', () => {
    const state = {
      gameState: {
        sequence: ['a', 'b', 'c']
      },
      playbackState: S.Just({ index: 3 })
    };

    const result = subject(state);

    expect(result).toBe(S.Nothing);
  });
});

describe('getNextPlaybackDelay', () => {
  const subject = sut.getNextPlaybackDelay;

  it('no playback', () => {
    const state = { playbackState: S.Nothing };

    const result = subject(state);

    expect(result).toBe(0);
  });

  it('section being highlighted', () => {
    const state = { playbackState: S.Just({ isVisible: true }) };

    const result = subject(state);

    expect(result).toBe(PLAYBACK_SHOW_TIME);
  });

  it('no section highlighted', () => {
    const state = { playbackState: S.Just({ isVisible: false }) };

    const result = subject(state);

    expect(result).toBe(PLAYBACK_PAUSE_TIME);
  });
});

describe('isPlaybackDone', () => {
  const subject = sut.isPlaybackDone;

  it('no playback', () => {
    const state = { gameState: {}, playbackState: S.Nothing };

    const result = subject(state);

    expect(result).toBe(true);
  });

  it('playback running', () => {
    const state = {
      gameState: { sequence: ['a', 'b', 'c'] },
      playbackState: S.Just({ index: 1 })
    };

    const result = subject(state);

    expect(result).toBe(false);
  });

  it('playback done', () => {
    const state = {
      gameState: { sequence: ['a', 'b', 'c'] },
      playbackState: S.Just({ index: 3 })
    };

    const result = subject(state);

    expect(result).toBe(true);
  });
});
