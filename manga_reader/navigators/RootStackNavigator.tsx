import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useMemo, useState} from 'react';
import {RootStackParamList} from '../custom_types/navigation_types';
import Login from '../pages/Login';
import Register_1 from '../pages/Registration_1';
import Register_2 from '../pages/Registration_2';
import Registration3 from '../pages/Registration_3';
import ModalNav from '../navigators/ModalStackNavigator';
import {connect, ConnectedProps} from 'react-redux';
import messaging from '@react-native-firebase/messaging';

import type {RootReducerType} from '../store/rootReducer';
import axios from 'axios';

const mapStateToProps = (state: RootReducerType) => ({
  sessionActive: state.session.session.sessionActive,
  token: state.session.session.token,
});
const connector = connect(mapStateToProps, {});

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
