/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {persistedStore, store} from './store/store';
import Axios from 'axios';
import Toast from 'react-native-toast-message';
import {enableScreens} from 'react-native-screens';
import RootStackNav from './navigators/RootStackNavigator';

enableScreens();

Axios.defaults.baseURL = 'http://192.168.0.101:8000';

const App = () => {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistedStore}>
          <SafeAreaProvider>
            <RootStackNav />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
      <Toast ref={ref => Toast.setRef(ref)} />
    </>
  );
};

export default App;
