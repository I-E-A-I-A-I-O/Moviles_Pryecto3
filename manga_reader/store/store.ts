import {createStore} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';
import rootReducer from './rootReducer';

import type {RootReducerType} from './rootReducer';

const persistedReducer = persistReducer<RootReducerType, any>(
  {
    key: 'root',
    storage: AsyncStorage,
  },
  rootReducer,
);

const store = createStore(persistedReducer);

const persistedStore = persistStore(store);

export {store, persistedStore};
