import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducers from './reducers';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['buildings']
};

let composeEnhancers = compose;
if(__DEV__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}
const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(
  persistedReducer,
  { },
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

const persistor = persistStore(store);

export {
  store,
  persistor
};