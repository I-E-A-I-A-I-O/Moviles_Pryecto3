import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootTabNavigatorParamList} from '../custom_types/navigation_types';
import Feed from '../pages/Feed';
import Profile from '../pages/Profile';
import {Icon} from 'react-native-elements';

const Tab = createBottomTabNavigator<RootTabNavigatorParamList>();

const RootTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name={'Feed'}
        component={Feed}
        options={{
          tabBarIcon: focused => (
            <Icon
              size={25}
              type={'font-awesome-5'}
              name={'comment'}
              color={focused.focused ? '#e94560' : '#84142d'}
              solid={focused.focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name={'Profile'}
        component={Profile}
        options={{
          tabBarIcon: focused => (
            <Icon
              size={25}
              type={'font-awesome-5'}
              name={'user-circle'}
              color={focused.focused ? '#e94560' : '#84142d'}
              solid={focused.focused}
            />
          ),
          title: ' Profile',
        }}
        initialParams={{
          user_id: undefined,
          deviceUser: true,
          name: '',
        }}
      />
    </Tab.Navigator>
  );
};

export default RootTabNavigator;
