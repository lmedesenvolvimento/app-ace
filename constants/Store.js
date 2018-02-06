import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk'
import createLogger from 'redux-logger';

// const middleware = [createLogger, thunk ];
const middleware = [thunk ];

import reducers from '../redux/reducers';

export function configureStore() {
  return compose( applyMiddleware(...middleware))(createStore)(reducers)
}

export default {
  instance: null
}
