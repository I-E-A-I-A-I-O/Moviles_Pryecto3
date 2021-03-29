import React from 'react';
import {TextStyle, Pressable} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
  RootTabNavigatorParamList,
  ModalStackParamList,
} from '../custom_types/navigation_types';
import {CompositeNavigationProp} from '@react-navigation/native';
import {connect, ConnectedProps} from 'react-redux';

import type {RootReducerType as CombinedState} from '../store/rootReducer';
import {UserAvatar} from '../components';

type DashboardScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabNavigatorParamList, 'Dashboard'>,
  StackNavigationProp<ModalStackParamList>
>;

const mapStateToProps = (state: CombinedState) => ({
  state: state.session.session,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: DashboardScreenNavigationProp;
};

const Dashboard = (props: Props) => {
  return (
    <ScrollView>
      <Input
        placeholder={'Search something'}
        style={textStyle[0]}
        leftIcon={
          <Pressable
            android_ripple={{
              color: 'gray',
              borderless: true,
            }}
            onPress={() =>
              props.navigation.navigate('ProfileModal', {
                deviceUser: true,
                name: props.state.name,
                user_id: props.state.id,
              })
            }>
            <UserAvatar
              size={'medium'}
              user_id={props.state.id}
              style={undefined}
            />
          </Pressable>
        }
      />
    </ScrollView>
  );
};

const textStyle: TextStyle[] = [
  {
    fontSize: 18,
    marginTop: 15,
  },
];

export default connector(Dashboard);
