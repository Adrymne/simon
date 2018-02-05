import Future from 'fluture';
import S from 'sanctuary-module';
import { getNextPlaybackDelay, isPlaybackPhase } from 'store/selectors';
import { advancePlayback } from 'store/actions';
import { runSubscription } from 'utils';
import { POSITIONS } from 'types';

// generate a random integer in the range [0, bound)
const randomInt = bound => Math.floor(Math.random() * bound);
// Randomly select the next step in the sequence
export const generateStep = () => POSITIONS[randomInt(POSITIONS.length)];

// playbackSub :: (GetState, Dispatch) -> Future () ()
const playbackSub = runSubscription(
  state =>
    isPlaybackPhase(state)
      ? Future.after(getNextPlaybackDelay(state), S.Just(advancePlayback()))
      : Future.of(S.Nothing)
);
// runPlayback :: (GetState, Dispatch) -> Promise
export const runPlayback = (getState, dispatch) =>
  playbackSub(getState, dispatch).promise();
