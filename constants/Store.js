import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';

const middleware = [thunk ];

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['preferences', 'publicareas']
};

import reducers from '../redux/reducers';

const persistedReducer = persistReducer(persistConfig, reducers);

export const configureStore = () => {
  const store = createStore(persistedReducer, applyMiddleware(thunk));
  const persistor = persistStore(store);
  return {
    store,
    persistor
  };
};

export default {
  instance: null
};

