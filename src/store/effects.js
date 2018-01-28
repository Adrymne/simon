import Future from 'fluture';
import { pipe } from 'ramda';
import { POSITIONS } from 'types';
import { PLAYBACK_DELAY } from 'invariants';
import { advancePlayback } from 'store/actions';
import { isPlaybackDone } from 'store/reducers';

// GENERATE STEP

// generate a random integer in the range [0, bound)
const randomInt = bound => Math.floor(Math.random() * bound);
// Randomly select the next step in the sequence
export const generateStep = () => POSITIONS[randomInt(POSITIONS.length)];

// RUN PLAYBACK

// updateStore :: (() -> State, Action -> ()) -> () -> State
const updateStore = (getState, dispatch) => () => {
  dispatch(advancePlayback());
  return getState();
};
// runInterval :: Int -> (() -> a) -> (a -> Bool) -> Future () ()
const runInterval = (delay, f, pred) =>
  Future((reject, resolve) => {
    setTimeout(pipe(f, pred, resolve), delay);
  }).chain(isDone => (isDone ? Future.of() : runInterval(delay, f, pred)));
// Run the sequence playback
// Like Elm's Time subscription, the model is used to determine when to stop
// TODO: need to pause between sequence elements
// if not then the same position multiple times in a row becomes harder to spot
export const runPlayback = (getState, dispatch) =>
  runInterval(
    PLAYBACK_DELAY,
    updateStore(getState, dispatch),
    isPlaybackDone
  ).promise();
