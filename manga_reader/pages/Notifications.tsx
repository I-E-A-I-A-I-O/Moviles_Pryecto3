import React from 'react';
import {
  ListRenderItemInfo,
  View,
  VirtualizedList,
  TextStyle,
  ViewStyle,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {Text} from 'react-native-elements';
import axios from 'axios';
import toast from 'react-native-toast-message';
import {connect, ConnectedProps} from 'react-redux';
import {UserBadge} from '../components';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {CompositeNavigationProp} from '@react-navigation/native';

import type {RootReducerType as CombinedState} from '../store/rootReducer';
import type {
  ModalStackParamList,
  RootTabNavigatorParamList,
} from '../custom_types/navigation_types';

type NotiPageNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabNavigatorParamList, 'Notifications'>,
  StackNavigationProp<ModalStackParamList>
>;

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
});
const mapDispatchToProps = {
  setHasNotis: (state: boolean) => ({
    type: 'CHANGE_NOTIFICATION_STATUS',
    data: state,
  }),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: NotiPageNavProp;
};

type Notification = {
  id: string;
  type: string;
  rlink?: string;
  plink?: string;
  profile_id?: string;
  post_id?: string;
  poster_profile?: string;
};

type State = {
  notifications: Notification[];
  loading: boolean;
  refreshing: boolean;
};

class NotificationsPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {loading: true, refreshing: false, notifications: []};
  }

  private fetchNotifications = async () => {
    try {
      if (!this.state.loading) {
        this.setState({
          ...this.state,
          loading: true,
        });
      }
      const response = await axios.get('/notifications/user', {
        headers: {authorization: this.props.token},
        timeout: 2000,
      });
      this.setState({
        ...this.state,
        notifications: response.data.content,
      });
      const bool: boolean = response.data.count > 0;
      this.props.setHasNotis(bool);
    } catch (err) {
      console.error(err);
      toast.show({
        type: 'error',
        text1: 'Error retrieving notifications',
        position: 'bottom',
      });
    } finally {
      this.setState({
        ...this.state,
        loading: false,
      });
    }
  };

  private _onRefresh = async () => {
    if (!this.state.loading && !this.state.refreshing) {
      this.setState({
        ...this.state,
        refreshing: true,
      });
      await this.fetchNotifications();
      this.setState({
        ...this.state,
        refreshing: false,
      });
    }
  };

  private _listItem = (item: ListRenderItemInfo<Notification>) => (
    <>
      {item.item.type === 'REQUEST' ? (
        <UserBadge
          id={item.item.profile_id ?? ''}
          description={'Wants to connect with you. Go check their profile!'}
          onPress={() =>
            this.props.navigation.navigate('ProfileModal', {
              deviceUser: false,
              user_id: item.item.profile_id,
            })
          }
        />
      ) : (
        <UserBadge
          id={item.item.poster_profile ?? ''}
          description={'Made a new post. Go check it out!'}
        />
      )}
    </>
  );

  componentDidMount() {
    this.fetchNotifications();
  }

  render() {
    return (
      <VirtualizedList
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        data={this.state.notifications}
        getItem={(data, index) => this.state.notifications[index]}
        getItemCount={() => this.state.notifications.length}
        renderItem={this._listItem}
        ListHeaderComponent={
          <>
            {this.state.loading ? (
              <ActivityIndicator
                animating={true}
                color={'lime'}
                size={50}
                style={indicatorStyle}
              />
            ) : (
              <>
                {this.state.notifications.length === 0 ? (
                  <View style={viewStyle}>
                    <Text style={textStyle}>Up to date</Text>
                  </View>
                ) : null}
              </>
            )}
          </>
        }
      />
    );
  }
}

const textStyle: TextStyle = {
  fontSize: 25,
  fontWeight: 'bold',
};

const viewStyle: ViewStyle = {
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 150,
};

const indicatorStyle: ViewStyle = {
  alignSelf: 'center',
  marginTop: 100,
};

export default connector(NotificationsPage);
