import S from 'sanctuary-module';
import { addStep, advancePlayback, startPlayerTurn } from 'store/actions';
import subject from './playback';

it('ADD_STEP', () => {
  const state = S.Nothing;
  const action = addStep();

  const result = subject(state, action);

  expect(result).toEqual(S.Just({ index: 0, isVisible: true }));
});

describe('ADVANCE_PLAYBACK', () => {
  const action = advancePlayback();
  it('playback not running', () => {
    const state = S.Nothing;

    const result = subject(state, action);

    expect(result).toBe(S.Nothing);
  });

  it('item visible', () => {
    const state = S.Just({ index: 1, isVisible: true });

    const result = subject(state, action);

    expect(result).toEqual(S.Just({ index: 2, isVisible: false }));
  });

  it('item not visible', () => {
    const state = S.Just({ index: 1, isVisible: false });

    const result = subject(state, action);

    expect(result).toEqual(S.Just({ index: 1, isVisible: true }));
  });
});

it('START_PLAYER_TURN', () => {
  const state = 'blah';
  const action = startPlayerTurn();

  const result = subject(state, action);

  expect(result).toBe(S.Nothing);
});
