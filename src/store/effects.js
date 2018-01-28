import { POSITIONS } from 'types';
import { highlightSection } from 'store/actions';

// GENERATE STEP

// generate a random integer in the range [0, bound)
const randomInt = bound => Math.floor(Math.random() * bound);
// Randomly select the next step in the sequence
export const generateStep = () => POSITIONS[randomInt(POSITIONS.length)];

// PLAY SEQUENCE
// TODO: rewrite to be like Elm subscription (i.e. keep the update logic in the reducers)
const DELAY = 500;
const runHighlight = (dispatch, section) =>
  new Promise(resolve => {
    dispatch(highlightSection(section));
    setTimeout(resolve, DELAY);
  });
export const playSequence = (dispatch, sequence) =>
  sequence.reduce(
    (prev, section) => prev.then(() => runHighlight(dispatch, section)),
    Promise.resolve()
  );
