import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CredentialsEdition from '../pages/CredentialsEdition';

import type {DrawerNavigatorParamList} from '../custom_types/navigation_types';

const Drawer = createDrawerNavigator<DrawerNavigatorParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name={'CredentialsEdition'}
        component={CredentialsEdition}
        options={{title: 'Edit credentials'}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
