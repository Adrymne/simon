import { createReducer } from 'utils';
import { INPUT_SECTION } from 'store/actions';
import S from 'sanctuary-module';

export default createReducer(S.Nothing, {
  [INPUT_SECTION]: (state, action) => S.Just(action.payload)
});
