import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useMemo, useState} from 'react';
import {RootStackParamList} from '../custom_types/navigation_types';
import Login from '../pages/AuthPages/Login';
import Register_1 from '../pages/RegistrationPages/Registration_1';
import Register_2 from '../pages/AuthPages/Registration_2';
import Registration3 from '../pages/RegistrationPages/Registration_3';
import ModalNav from '../navigators/ModalStackNavigator';
import Recovery_1 from '../pages/RecoveryPages/EmailVerification';
import {connect, ConnectedProps} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {Notifications} from 'react-native-notifications';
import PasswordChange from '../pages/RecoveryPages/PasswordChange';

import type {RootReducerType} from '../store/rootReducer';

const mapStateToProps = (state: RootReducerType) => ({
  sessionActive: state.session.sessionActive,
  token: state.session.token,
});
const mapDispatchToProps = {
  setNotisState: (state: boolean) => ({
    type: 'CHANGE_NOTIFICATION_STATUS',
    data: state,
  }),
};
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const Stack = createStackNavigator<RootStackParamList>();

const RootStackNav = (props: Props) => {
  const [authorized, setAuthorized] = useState(false);

  useMemo(() => {
    const sessionChanged = () => {
      setAuthorized(props.sessionActive);
    };
    sessionChanged();
  }, [props.sessionActive]);

  useMemo(() => {
    const postToken = () => {
      if (props.sessionActive) {
        messaging()
          .getToken()
          .then(token => {
            console.info(`TOKEN:${token}`);
            axios
              .post(
                '/notifications/users',
                {
                  token: token,
                },
                {headers: {authorization: props.token}},
              )
              .then(res => {
                console.log(JSON.stringify(res));
              })
              .catch(err => {
                console.error(err);
              });
          });
      }
    };

    postToken();
  }, [props.sessionActive, props.token]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // @ts-ignore
      Notifications.postLocalNotification({
        title: remoteMessage.notification?.title ?? '',
        body: remoteMessage.notification?.body ?? '',
      });
      props.setNotisState(true);
    });

    return unsubscribe;
  }, [props]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!authorized ? (
          <>
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
              options={{title: 'Code verification'}}
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
              options={{title: 'Verify email'}}
              name={'Recovery_1'}
              component={Recovery_1}
            />
            <Stack.Screen
              options={{title: 'Update password'}}
              name={'Recovery_2'}
              component={PasswordChange}
            />
          </>
        ) : (
          <Stack.Screen
            name={'ModalStack'}
            component={ModalNav}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default connector(RootStackNav);
