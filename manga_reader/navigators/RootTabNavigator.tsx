import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootTabNavigatorParamList} from '../custom_types/navigation_types';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile'
import Notifications from '../pages/pageNotifications'
import Post from '../pages/pageToPost'
import {Icon} from 'react-native-elements';

const Tab = createBottomTabNavigator<RootTabNavigatorParamList>();

const RootTabNavigator = () => {
  return (
    <Tab.Navigator >
      <Tab.Screen
        name={'Dashboard'}
        component={Dashboard}
        options={{
          tabBarIcon: focused => (
            <Icon
              size={25}
              type={'font-awesome-5'}
              name={'home'}
              color={'black'}
              solid={focused.focused}
            />
          ),
          title: 'Home'
        }}
      />

    <Tab.Screen
        name={'Profile'}
        component={Profile}
        options={{
          tabBarIcon: focused => (
            <Icon
              size={25}
              type={'font-awesome'}
              name={'user'}
              color={'black'}
              solid={focused.focused}
            />
          ),
          title: 'Profile'
        }}
      />
      <Tab.Screen
        name={'Notifications'}
        component={Notifications}
        options={{
          tabBarIcon: focused => (
            <Icon
              size={25}
              type={'ion-icons'}
              name={'notifications'}
              color={'black'}
              solid={focused.focused}
            />
          ),
          title: 'Notifications'
        }}
        initialParams={{
          user_id: undefined,
          deviceUser: true,
          name: '',
      />
      <Tab.Screen
        name={'Post'}
        component={Post}
        options={{
          tabBarIcon: focused => (
            <Icon
              size={25}
              type={'material-icons'}
              name={'library-add'}
              color={'black'}
              solid={focused.focused}
            />
          ),
          title: 'Post'
        }}
      />
    </Tab.Navigator>
  );
};

export default RootTabNavigator;
