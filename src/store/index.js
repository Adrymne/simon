import { createStore, compose } from 'redux';
import { install } from 'redux-loop';
import rootReducer from './reducers';

export default createStore(
  rootReducer,
  compose(
    install(),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : v => v
  )
);
