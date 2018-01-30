import Future from 'fluture';
import S from 'sanctuary-module';
import { POSITIONS } from 'types';
import { getNextPlaybackDelay, isPlaybackDone } from 'store/selectors';
import { advancePlayback } from 'store/actions';
import { runSubscription } from 'utils';

// GENERATE STEP

// generate a random integer in the range [0, bound)
const randomInt = bound => Math.floor(Math.random() * bound);
// Randomly select the next step in the sequence
export const generateStep = () => POSITIONS[randomInt(POSITIONS.length)];

// playbackSub :: (GetState, Dispatch) -> Future () ()
const playbackSub = runSubscription(
  state =>
    isPlaybackDone(state)
      ? Future.of(S.Nothing)
      : Future.after(getNextPlaybackDelay(state), S.Just(advancePlayback()))
);
// runPlayback :: (GetState, Dispatch) -> Promise
export const runPlayback = (getState, dispatch) =>
  playbackSub(getState, dispatch).promise();
