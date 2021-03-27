import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ModalStackParamList} from '../custom_types/navigation_types';
import RootTabNav from './RootTabNavigator';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';

const Stack = createStackNavigator<ModalStackParamList>();

const ModalStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'TabNavigator'}
        options={{headerShown: false}}
        component={RootTabNav}
      />
      <Stack.Screen
        name={'Profile'}
        component={Profile}
        initialParams={{
          deviceUser: false,
          user_id: undefined,
        }}
        options={{title:'Profile'}}
      />
    </Stack.Navigator>
  );
};

export default ModalStack;
