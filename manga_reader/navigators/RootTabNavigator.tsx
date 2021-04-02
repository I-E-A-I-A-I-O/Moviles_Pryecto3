import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootTabNavigatorParamList} from '../custom_types/navigation_types';
import Dashboard from '../pages/Dashboard';
import NotificationsPage from '../pages/Notifications';
import Post from '../pages/pageToPost';
import {Icon} from 'react-native-elements';

const Tab = createBottomTabNavigator<RootTabNavigatorParamList>();

const RootTabNavigator = () => {
  return (
    <Tab.Navigator>
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
          title: 'Home',
        }}
      />
      <Tab.Screen
        name={'Notifications'}
        component={NotificationsPage}
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
          title: 'Notifications',
        }}
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
          title: 'Post',
        }}
      />
    </Tab.Navigator>
  );
};

export default RootTabNavigator;
