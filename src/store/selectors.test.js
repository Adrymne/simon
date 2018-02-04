import S from 'sanctuary-module';
import * as sut from './selectors';
import { Phase } from 'types';
import { PLAYBACK_SHOW_TIME, PLAYBACK_PAUSE_TIME } from 'invariants';

describe('getHighlightedSection', () => {
  const subject = sut.getHighlightedSection;

  it('no playback', () => {
    const state = { gameState: { sequence: [], phase: Phase.None } };

    const result = subject(state);

    expect(result).toBe(S.Nothing);
  });

  it('playback in progress, section visible', () => {
    const state = {
      gameState: {
        sequence: ['a', 'b', 'c'],
        phase: Phase.PlaybackOf({ index: 1, isVisible: true })
      }
    };

    const result = subject(state);

    expect(result).toEqual(S.Just('b'));
  });

  it('playback in progress, section not visible', () => {
    const state = {
      gameState: {
        sequence: ['a', 'b', 'c'],
        phase: Phase.PlaybackOf({ index: 1, isVisible: false })
      }
    };

    const result = subject(state);

    expect(result).toEqual(S.Nothing);
  });

  it('playback over', () => {
    const state = {
      gameState: {
        sequence: ['a', 'b', 'c'],
        phase: Phase.PlaybackOf({ index: 3, isVisible: false })
      }
    };

    const result = subject(state);

    expect(result).toBe(S.Nothing);
  });
});

describe('getNextPlaybackDelay', () => {
  const subject = sut.getNextPlaybackDelay;

  it('no playback', () => {
    const state = { gameState: { phase: Phase.None } };

    const result = subject(state);

    expect(result).toBe(0);
  });

  it('section being highlighted', () => {
    const state = {
      gameState: { phase: Phase.PlaybackOf({ index: 1, isVisible: true }) }
    };

    const result = subject(state);

    expect(result).toBe(PLAYBACK_SHOW_TIME);
  });

  it('no section highlighted', () => {
    const state = {
      gameState: { phase: Phase.PlaybackOf({ index: 1, isVisible: false }) }
    };

    const result = subject(state);

    expect(result).toBe(PLAYBACK_PAUSE_TIME);
  });
});
