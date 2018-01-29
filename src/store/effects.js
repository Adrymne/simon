import { POSITIONS } from 'types';

// GENERATE STEP

// generate a random integer in the range [0, bound)
const randomInt = bound => Math.floor(Math.random() * bound);
// Randomly select the next step in the sequence
export const generateStep = () => POSITIONS[randomInt(POSITIONS.length)];

export const waitFor = ms => new Promise(resolve => setTimeout(resolve, ms));
