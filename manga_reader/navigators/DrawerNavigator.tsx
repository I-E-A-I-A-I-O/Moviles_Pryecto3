import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import RootTabNav from './RootTabNavigator';
import AccOptionsStack from './AccountOptionsStack';

import type {DrawerNavigatorParamList} from '../custom_types/navigation_types';

const Drawer = createDrawerNavigator<DrawerNavigatorParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator drawerType={'slide'}>
      <Drawer.Screen
        name={'TabNavigator'}
        options={{title: 'Home'}}
        component={RootTabNav}
      />
      <Drawer.Screen
        name={'AccountOptions'}
        component={AccOptionsStack}
        options={{title: 'Account options'}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
