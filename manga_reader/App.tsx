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
import React, {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/es/integration/react';
import {persistedStore, store} from './store/store';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Register_1 from './pages/Registration_1';
import Register_2 from './pages/Registration_2';
import Login from './pages/Login';
import Registration3 from './pages/Registration_3';
import Axios from 'axios';
import Toast from 'react-native-toast-message';
import {RootStackParamList} from './custom_types/navigation_types';
import {enableScreens} from 'react-native-screens';
import ModalNav from './navigators/ModalStackNavigator';

enableScreens();

Axios.defaults.baseURL = 'http://192.168.0.101:8000';

const Stack = createStackNavigator<RootStackParamList>();

const postToken = async (token: string) => {
  setTimeout(() => {
    Axios.post('/notifications/', {
      token: token,
    })
      .then(res => {
        console.log(JSON.stringify(res));
      })
      .catch(err => {
        console.error(err);
      });
  }, 5000);
};

const App = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        console.info(`TOKEN:${token}`);
        postToken(token);
      });
    return messaging().onTokenRefresh(token => {
      console.info(`TOKEN:${token}`);
    });
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistedStore}>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  options={{headerShown: false}}
                  name={'Login'}
                  component={Login}
                />
                <Stack.Screen
                  options={{title: 'Registration'}}
                  name={'Register_1'}
                  component={Register_1}
                />
                <Stack.Screen
                  options={{title: 'Registration'}}
                  name={'Register_2'}
                  component={Register_2}
                  initialParams={{verification_id: ''}}
                />
                <Stack.Screen
                  options={{title: 'Registration'}}
                  name={'Register_3'}
                  component={Registration3}
                />
                <Stack.Screen
                  name={'ModalStack'}
                  component={ModalNav}
                  options={{headerShown: false}}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
      <Toast ref={ref => Toast.setRef(ref)} />
    </>
  );
};

export default App;
