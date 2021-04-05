import React from 'react';
import {
  TextStyle,
  Pressable,
  View,
  ViewStyle,
  VirtualizedList,
  ListRenderItemInfo,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {Input, Icon, Card} from 'react-native-elements';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
  RootTabNavigatorParamList,
  ModalStackParamList,
} from '../../custom_types/navigation_types';
import {CompositeNavigationProp} from '@react-navigation/native';
import {connect, ConnectedProps} from 'react-redux';
import {ModalDropdown, Post, UserAvatar, UserBadge} from '../../components';

import type {RootReducerType as CombinedState} from '../../store/rootReducer';
import type {SearchBarFilters} from '../../custom_types/state_types';
import axios from 'axios';
import Toast from 'react-native-toast-message';

type DashboardScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabNavigatorParamList, 'Dashboard'>,
  StackNavigationProp<ModalStackParamList>
>;

const mapStateToProps = (state: CombinedState) => ({
  state: state.session,
});

const mapDispatchToProps = {
  reduxLogout: () => ({type: 'DELETE_SESSION_DATA'}),
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: DashboardScreenNavigationProp;
};

const options: SearchBarFilters = {
  searchOptions: [
    {label: 'Posts', value: 'posts'},
    {label: 'People', value: 'people'},
    {label: 'Jobs', value: 'jobs'},
    {label: 'Organizations', value: 'organizations'},
  ],
  scope: [
    {label: 'Connections', value: 'connections'},
    {label: 'Global', value: 'global'},
  ],
};

type ListData = {
  id: string;
};

type State = {
  searchOption: string;
  scope: string;
  data: ListData[];
  search: string;
  loading: boolean;
};

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scope: 'connections',
      searchOption: 'posts',
      data: [],
      search: '',
      loading: false,
    };
  }

  private search = async () => {
    if (
      this.state.search.length === 0 &&
      (this.state.searchOption === 'people' ||
        this.state.searchOption === 'organization')
    ) {
      Toast.show({
        text1: 'Search bar is empty!',
        type: 'error',
        position: 'bottom',
      });
      return;
    }
    try {
      this.setState({
        ...this.state,
        loading: true,
      });
      const response = await axios.get(
        `/list/${this.state.searchOption}/${this.state.scope}/${this.state.search}`,
        {
          headers: {authorization: this.props.state.token},
        },
      );
      this.setState({
        ...this.state,
        data: response.data.content,
      });
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: err.response.data.content,
        position: 'bottom',
      });
    } finally {
      this.setState({
        ...this.state,
        loading: false,
      });
    }
  };

  componentDidMount() {
    this.search();
  }

  private renderItem = (item: ListRenderItemInfo<ListData>) => {
    switch (this.state.searchOption) {
      case 'people': {
        return (
          <UserBadge
            id={item.item.id}
            onPress={() =>
              this.props.navigation.navigate('ProfileModal', {
                deviceUser: false,
                user_id: item.item.id,
              })
            }
          />
        );
      }
      case 'posts': {
        return (
          <Pressable
            android_ripple={{color: 'gray'}}
            onPress={() =>
              this.props.navigation.navigate('PostThread', {
                post_id: item.item.id,
              })
            }>
            <Post id={item.item.id} />
          </Pressable>
        );
      }
      default: {
        return <></>;
      }
    }
  };

  render() {
    return (
      <VirtualizedList
        data={this.state.data}
        getItem={(data, index) => this.state.data[index]}
        getItemCount={() => this.state.data.length}
        renderItem={this.renderItem}
        refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this.search}
          />
        }
        ListHeaderComponent={
          <View>
            <Input
              placeholder={'Search something'}
              style={textStyle[0]}
              onChangeText={text =>
                this.setState({...this.state, search: text})
              }
              leftIcon={
                <Pressable
                  android_ripple={{
                    color: 'gray',
                    borderless: true,
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('ProfileModal', {
                      deviceUser: true,
                      user_id: this.props.state.id,
                    })
                  }>
                  <UserAvatar
                    size={'medium'}
                    user_id={this.props.state.id}
                    style={undefined}
                  />
                </Pressable>
              }
              rightIcon={
                <>
                  {this.state.loading ? (
                    <ActivityIndicator color={'lime'} />
                  ) : (
                    <Pressable
                      android_ripple={{
                        color: 'gray',
                        borderless: true,
                      }}
                      onPress={this.search}>
                      <Icon type={'font-awesome-5'} name={'search'} />
                    </Pressable>
                  )}
                </>
              }
            />
            <View style={buttonStyle[1]}>
              <ModalDropdown
                data={options.searchOptions}
                style={buttonStyle[0]}
                description={'Search type'}
                onInput={value =>
                  this.setState({...this.state, searchOption: value})
                }
              />
              <ModalDropdown
                data={options.scope}
                style={buttonStyle[0]}
                description={'Search scope'}
                onInput={value => this.setState({...this.state, scope: value})}
              />
            </View>
            <Card.Divider />
          </View>
        }
      />
    );
  }
}

const textStyle: TextStyle[] = [
  {
    fontSize: 18,
    marginTop: 15,
  },
];

const buttonStyle: ViewStyle[] = [
  {
    marginLeft: 15,
    backgroundColor: 'gray',
    borderRadius: 25,
  },
  {
    flexDirection: 'row',
  },
];

export default connector(Dashboard);
