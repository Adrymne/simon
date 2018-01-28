import { createReducer } from 'utils';
import { HIGHLIGHT_SECTION, START_PLAYER_TURN } from 'store/actions';

const DEFAULT = null;

export default createReducer(DEFAULT, {
  [HIGHLIGHT_SECTION]: (state, action) => action.payload,
  [START_PLAYER_TURN]: () => DEFAULT
});

export const getHighlightedSection = state => state;
