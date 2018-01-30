import { Cmd, loop } from 'redux-loop';
import { propOr, identity } from 'ramda';
import S from 'sanctuary-module';
import Future from 'fluture';

export const createReducer = (initial, spec) => (state = initial, action) =>
  propOr(identity, action.type, spec)(state, action);

// Helper for specifying simple case of Cmd.run
export const runWith = f => state => {
  const { cmd, onSuccess, args } = f(state);
  return loop(state, Cmd.run(cmd, { successActionCreator: onSuccess, args }));
};
export const run = spec => runWith(() => spec);

// runSubscription :: (State -> Future a (Maybe Action), GetState, Dispatch) -> Future () ()
// Helper to create an Elm-like subscription with redux
export const runSubscription = S.curry3((sub, getState, dispatch) =>
  sub(getState()).chain(
    S.maybe(Future.of(undefined), action => {
      dispatch(action);
      return runSubscription(sub, getState, dispatch);
    })
  )
);
