export const ADD_STEP = 'ADD_STEP';
export const addStep = section => ({ type: ADD_STEP, payload: section });

export const START_PLAYER_TURN = 'START_PLAYER_TURN';
export const startPlayerTurn = () => ({ type: START_PLAYER_TURN });

export const ADVANCE_PLAYBACK = 'ADVANCE_PLAYBACK';
export const advancePlayback = () => ({ type: ADVANCE_PLAYBACK });

export const INPUT_SECTION = 'INPUT_SECTION';
export const inputSection = section => ({
  type: INPUT_SECTION,
  payload: section
});
