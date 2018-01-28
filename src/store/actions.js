export const NEW_GAME = 'NEW_GAME';
export const newGame = () => ({ type: NEW_GAME });

export const ADD_STEP = 'ADD_STEP';
export const addStep = step => ({ type: ADD_STEP, payload: step });

export const START_PLAYER_TURN = 'START_PLAYER_TURN';
export const startPlayerTurn = () => ({ type: START_PLAYER_TURN });

export const ADVANCE_PLAYBACK = 'ADVANCE_PLAYBACK';
export const advancePlayback = () => ({ type: ADVANCE_PLAYBACK });
