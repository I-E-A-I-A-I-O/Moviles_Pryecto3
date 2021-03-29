import React from 'react';
import {RefreshControl, TextStyle, View, ViewStyle} from 'react-native';
import {Text} from 'react-native-elements';
import {RouteProp} from '@react-navigation/native';
import {ModalStackParamList} from '../custom_types/navigation_types';
import {StackNavigationProp} from '@react-navigation/stack';
import {connect, ConnectedProps} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {
  DescriptionComponent,
  ListWDescription,
  ListWODescription,
  ProfileSkeleton,
  UserAvatar,
} from '../components';
import type {RootReducerType as CombinedState} from '../store/rootReducer';
import type {ProfileState} from '../custom_types/state_types';

const mapStateToProps = (state: CombinedState) => ({
  state: state.session.session,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type ProfilePageNavProp = StackNavigationProp<
  ModalStackParamList,
  'ProfileModal'
>;
type ProfilePageRouteProp = RouteProp<ModalStackParamList, 'ProfileModal'>;
type Props = PropsFromRedux & {
  route: ProfilePageRouteProp;
  navigation: ProfilePageNavProp;
};

const initialState: ProfileState = {
  name: '',
  abilities: [],
  awards: [],
  description: undefined,
  education: [],
  experience: [],
  projects: [],
  recent_posts: [],
  recommended_by: [],
  refreshing: false,
  loading: true,
};

class ProfileModal extends React.Component<Props, ProfileState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initialState,
      name: this.props.route.params.name,
    };
  }

  getData = async () => {
    if (!this.state.loading) {
      this.setState({...this.state, loading: true});
    }
    try {
      const response = await axios.get(
        `/users/user/${this.props.route.params.user_id}`,
        {
          headers: {
            authorization: this.props.state.token,
          },
        },
      );
      this.setState({
        ...this.state,
        abilities: response.data.abilities,
        awards: response.data.awards,
        description: response.data.description ?? initialState.description,
        education: response.data.education,
        experience: response.data.experience,
        projects: response.data.projects,
        recommended_by: response.data.recent_posts,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Could not retrieve the information',
        autoHide: true,
        position: 'bottom',
      });
    }
  };

  componentDidMount() {
    this.getData();
  }

  onRefresh = async () => {
    if (!this.state.loading) {
      this.setState({
        ...this.state,
        refreshing: true,
      });
      await this.getData();
      this.setState({
        ...this.state,
        refreshing: false,
      });
    }
  };

  render() {
    return (
      <FlatList
        data={[]}
        renderItem={() => null}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        ListHeaderComponent={
          <View>
            {this.state.loading ? (
              <ProfileSkeleton />
            ) : (
              <View>
                <UserAvatar
                  user_id={this.props.route.params.user_id ?? ''}
                  size={'xlarge'}
                  style={AvatarStyle}
                />
                <Text style={TextStyles}>
                  {this.state.name} {this.state.description?.last_name}
                </Text>
                <DescriptionComponent
                  description={this.state.description}
                  deviceUser={this.props.route.params.deviceUser}
                  navigate={() => null}
                />
                <ListWODescription
                  abilities={this.state.abilities}
                  deviceUser={this.props.route.params.deviceUser}
                  token={this.props.state.token}
                />
                <ListWDescription
                  title={'Job experience'}
                  data={this.state.experience}
                  type={'job'}
                  onCreate={() => null}
                  onSeeMore={(id: string) =>
                    this.props.navigation.navigate('UserAttributeDescription', {
                      id: id,
                      type: 'job',
                      deviceUser: this.props.route.params.deviceUser,
                      token: this.props.state.token,
                    })
                  }
                  deviceUser={this.props.route.params.deviceUser}
                  token={this.props.state.token}
                />
                <ListWDescription
                  title={'Awards'}
                  type={'award'}
                  data={this.state.awards}
                  onCreate={() => null}
                  onSeeMore={(id: string) =>
                    this.props.navigation.navigate('UserAttributeDescription', {
                      id: id,
                      type: 'award',
                      deviceUser: this.props.route.params.deviceUser,
                      token: this.props.state.token,
                    })
                  }
                  deviceUser={this.props.route.params.deviceUser}
                  token={this.props.state.token}
                />
                <ListWDescription
                  title={'Projects'}
                  type={'project'}
                  data={this.state.projects}
                  onCreate={() => null}
                  onSeeMore={(id: string) =>
                    this.props.navigation.navigate('UserAttributeDescription', {
                      id: id,
                      type: 'project',
                      deviceUser: this.props.route.params.deviceUser,
                      token: this.props.state.token,
                    })
                  }
                  deviceUser={this.props.route.params.deviceUser}
                  token={this.props.state.token}
                />
                <ListWDescription
                  title={'Education'}
                  type={'education'}
                  data={this.state.education}
                  onCreate={() => null}
                  onSeeMore={(id: string) =>
                    this.props.navigation.navigate('UserAttributeDescription', {
                      id: id,
                      type: 'education',
                      deviceUser: this.props.route.params.deviceUser,
                      token: this.props.state.token,
                    })
                  }
                  deviceUser={this.props.route.params.deviceUser}
                  token={this.props.state.token}
                />
              </View>
            )}
          </View>
        }
      />
    );
  }
}

const AvatarStyle: ViewStyle = {
  alignSelf: 'center',
};

const TextStyles: TextStyle[] = [
  {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 25,
  },
  {
    alignSelf: 'center',
  },
];

export default connector(ProfileModal);
