import S from 'sanctuary-module';
import { createReducer } from 'utils';
import { ADD_STEP, ADVANCE_PLAYBACK, START_PLAYER_TURN } from 'store/actions';

/*
State = Maybe {
  index :: Int,
  isVisible :: Boolean
}
*/

const DEFAULT = S.Nothing;
const INITIAL = S.Just({ index: 0, isVisible: true });

const nextStep = ({ isVisible, index }) =>
  isVisible
    ? { index: index + 1, isVisible: false }
    : { index: index, isVisible: true };

export default createReducer(DEFAULT, {
  [ADD_STEP]: () => INITIAL,
  [ADVANCE_PLAYBACK]: state => S.map(nextStep, state),
  [START_PLAYER_TURN]: () => INITIAL
});
