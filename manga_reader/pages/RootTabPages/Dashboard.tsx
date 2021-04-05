import React from 'react';
import {
  TextStyle,
  Pressable,
  View,
  ViewStyle,
  VirtualizedList,
  ListRenderItemInfo,
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
    {label: 'People', value: 'people'},
    {label: 'Jobs', value: 'jobs'},
    {label: 'Posts', value: 'posts'},
    {label: 'Organizations', value: 'organizations'},
  ],
  scope: [
    {label: 'Global', value: 'global'},
    {label: 'Connections', value: 'connections'},
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
};

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      scope: 'global',
      searchOption: 'people',
      data: [],
      search: '',
    };
  }

  private search = async () => {
    if (this.state.search.length === 0 && this.state.searchOption !== 'posts') {
      return;
    }
    try {
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
        return <Post id={item.item.id} />;
      }
      default: {
        return <></>;
      }
    }
  };

  private closeSession = async () => {
    try {
      await axios.delete('/users/user/auth', {
        headers: {authorization: this.props.state.token},
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.props.reduxLogout();
    }
  };

  render() {
    return (
      <VirtualizedList
        data={this.state.data}
        getItem={(data, index) => this.state.data[index]}
        getItemCount={() => this.state.data.length}
        renderItem={this.renderItem}
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
                  }
                  onLongPress={this.closeSession}>
                  <UserAvatar
                    size={'medium'}
                    user_id={this.props.state.id}
                    style={undefined}
                  />
                </Pressable>
              }
              rightIcon={
                <Pressable
                  android_ripple={{
                    color: 'gray',
                    borderless: true,
                  }}
                  onPress={this.search}>
                  <Icon type={'font-awesome-5'} name={'search'} />
                </Pressable>
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
