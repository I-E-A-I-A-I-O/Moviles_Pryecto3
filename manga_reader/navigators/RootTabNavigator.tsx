import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {RootTabNavigatorParamList} from '../custom_types/navigation_types';
import Dashboard from '../pages/RootTabPages/Dashboard';
import NotificationsPage from '../pages/RootTabPages/Notifications';
import Post from '../pages/RootTabPages/pageToPost';
import Compaines from '../pages/RootTabPages/pageCompaines'
import Jobs from '../pages/RootTabPages/pageJobs'
import {Icon} from 'react-native-elements';
import {ConnectedProps, connect} from 'react-redux';
import type {RootReducerType as CombinedState} from '../store/rootReducer';

const mapStateToProps = (state: CombinedState) => ({
  hasNotis: state.session.hasNotis,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const Tab = createBottomTabNavigator<RootTabNavigatorParamList>();

const RootTabNavigator = (props: Props) => {
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
          tabBarIcon: () => (
            <Icon
              size={25}
              type={'font-awesome-5'}
              name={'bell'}
              color={props.hasNotis ? 'gold' : 'black'}
              solid={props.hasNotis}
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
      <Tab.Screen
        name={'Compaines'}
        component={Compaines}
        options={{
          tabBarIcon: focused => (
            <Icon
              size={25}
              type={'font-awesome-5'}
              name={'building'}
              color={'black'}
              solid={focused.focused}
            />
          ),
          title: 'Compaines',
        }}
      />
      <Tab.Screen
        name={'Jobs'}
        component={Jobs}
        options={{
          tabBarIcon: focused => (
            <Icon
              size={25}
              type={'font-awesome-5'}
              name={'briefcase'}
              color={'black'}
              solid={focused.focused}
            />
          ),
          title: 'Jobs',
        }}
      />
    </Tab.Navigator>
  );
};

export default connector(RootTabNavigator);
