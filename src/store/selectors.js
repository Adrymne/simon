import { propEq } from 'ramda';
import S from 'sanctuary-module';
import { STARTUP, PLAYER } from 'types';

/*
State = {
  appMode :: Startup | Playback | Player,
  gameState: {
    sequence :: [Section],
    playback :: Maybe { index :: Int, isVisible :: Boolean }
  }
}
*/

// isStartupPhase :: State -> Boolean
export const isStartupPhase = propEq('appMode', STARTUP);
// isPlayerPhase :: State -> Boolean
export const isPlayerPhase = propEq('appMode', PLAYER);

// getHighlightedSection :: State -> Maybe Section
export const getHighlightedSection = ({ gameState: { playback, sequence } }) =>
  S.chain(
    ({ isVisible, index }) => (isVisible ? S.at(index, sequence) : S.Nothing),
    playback
  );
