import S from 'sanctuary-module';
import * as sut from './selectors';

describe('getHighlightedSection', () => {
  const subject = sut.getHighlightedSection;

  it('no playback', () => {
    const state = { gameState: { playback: S.Nothing, sequence: [] } };

    const result = subject(state);

    expect(result).toBe(S.Nothing);
  });

  it('playback in progress, section visible', () => {
    const state = {
      gameState: {
        playback: S.Just({ index: 1, isVisible: true }),
        sequence: ['a', 'b', 'c']
      }
    };

    const result = subject(state);

    expect(result).toEqual(S.Just('b'));
  });

  it('playback in progress, section not visible', () => {
    const state = {
      gameState: {
        playback: S.Just({ index: 1, isVisible: false }),
        sequence: ['a', 'b', 'c']
      }
    };

    const result = subject(state);

    expect(result).toEqual(S.Nothing);
  });

  it('playback over', () => {
    const state = {
      gameState: {
        playback: S.Just({ index: 3 }),
        sequence: ['a', 'b', 'c']
      }
    };

    const result = subject(state);

    expect(result).toBe(S.Nothing);
  });
});
