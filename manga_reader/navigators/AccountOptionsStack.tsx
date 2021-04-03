import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AccountOptionsMenu from '../pages/DrawerNavPages/AccountOptionsMenu';
import PasswordVerification from '../pages/AuthPages/PasswordVerification';
import EmailUpdatePage from '../pages/DrawerNavPages/EditEmail';
import PasswordUpdatePage from '../pages/DrawerNavPages/EditPassword';
import PhoneUpdatePage from '../pages/DrawerNavPages/EditPhone';

import type {AccOptionsNavigatorParamList} from '../custom_types/navigation_types';

const Stack = createStackNavigator<AccOptionsNavigatorParamList>();

const AccOptionsStack = () => {
  return (
    <Stack.Navigator initialRouteName={'Menu'}>
      <Stack.Screen
        name={'Menu'}
        component={AccountOptionsMenu}
        options={{title: 'Account options'}}
      />
      <Stack.Screen
        name={'PasswordVerification'}
        component={PasswordVerification}
        options={{title: 'Password verification'}}
      />
      <Stack.Screen
        name={'UpdateEmail'}
        component={EmailUpdatePage}
        options={{title: 'Update your email'}}
      />
      <Stack.Screen
        name={'UpdatePassword'}
        component={PasswordUpdatePage}
        options={{title: 'Update your password'}}
      />
      <Stack.Screen
        name={'UpdatePhone'}
        component={PhoneUpdatePage}
        options={{title: 'Update your phone number'}}
      />
    </Stack.Navigator>
  );
};

export default AccOptionsStack;
