import React from 'react';
import {
  Pressable,
  RefreshControl,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Text, Card, Icon} from 'react-native-elements';
import UserAvatar from '../components/avatar';
import {RouteProp, CompositeNavigationProp} from '@react-navigation/native';
import {
  RootTabNavigatorParamList,
  ModalStackParamList,
} from '../custom_types/navigation_types';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {StackNavigationProp} from '@react-navigation/stack';
import {connect, ConnectedProps} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import type {RootReducerType as CombinedState} from '../store/rootReducer';

const mapStateToProps = (state: CombinedState) => ({
  state: state.session.session,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type ProfilePageNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabNavigatorParamList, 'Profile'>,
  StackNavigationProp<ModalStackParamList>
>;
type ProfilePageRouteProp = RouteProp<RootTabNavigatorParamList, 'Profile'>;
type Props = PropsFromRedux & {
  route: ProfilePageRouteProp;
  navigation: ProfilePageNavProp;
};
type State = {
  name: string;
  recent_posts: string[];
  description: {
    description: string | undefined;
    country: string | undefined;
    address: string | undefined;
    gender: string | undefined;
    age: number | undefined;
    last_name: string | undefined;
    birth_date: string | undefined;
  };
  abilities: string[];
  awards: {name: string; id: string}[];
  education: {title: string; id: string}[];
  experience: {title: string; id: string}[];
  projects: {name: string; id: string}[];
  recommended_by: string[];
  refreshing: boolean;
  loading: boolean;
};

const initialState: State = {
  name: '',
  abilities: [],
  awards: [],
  description: {
    address: undefined,
    age: undefined,
    birth_date: undefined,
    country: undefined,
    description: undefined,
    gender: undefined,
    last_name: undefined,
  },
  education: [],
  experience: [],
  projects: [],
  recent_posts: [],
  recommended_by: [],
  refreshing: false,
  loading: true,
};

class Profile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      ...initialState,
      name: this.props.route.params.deviceUser
        ? this.props.state.name
        : this.props.route.params.name,
    };
  }

  getData = async () => {
    if (!this.state.loading) {
      this.setState({...this.state, loading: true});
    }
    try {
      const response = await axios.get(
        `/users/user/${
          this.props.route.params.deviceUser
            ? this.props.state.id
            : this.props.route.params.user_id
        }`,
        {
          headers: {
            authorization: this.props.state.token,
          },
        },
      );
      this.setState({
        ...this.state,
        abilities: response.data.abilities,
        awards: response.data.abilites,
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
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }>
        {this.state.loading ? (
          <View style={AvatarStyle}>
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                flexDirection={'column'}
                alignItems={'center'}
                alignSelf={'center'}>
                <SkeletonPlaceholder.Item
                  width={150}
                  height={150}
                  borderRadius={100}
                />
                <SkeletonPlaceholder.Item
                  width={220}
                  height={30}
                  borderRadius={4}
                  marginTop={25}
                />
                <SkeletonPlaceholder.Item
                  width={380}
                  height={200}
                  borderRadius={5}
                  marginTop={25}
                />
                <SkeletonPlaceholder.Item
                  width={380}
                  height={200}
                  borderRadius={5}
                  marginTop={25}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
          </View>
        ) : (
          <View>
            <UserAvatar
              user_id={
                this.props.route.params.deviceUser
                  ? this.props.state.id
                  : this.props.route.params.user_id ?? ''
              }
              size={'xlarge'}
              style={AvatarStyle}
            />
            <Text style={TextStyles}>
              {this.state.name} {this.state.description.last_name}
            </Text>
            <Card>
              <Card.Title>
                General
                {this.props.route.params.deviceUser && (
                  <Pressable
                    android_ripple={{
                      borderless: true,
                      color: 'gray',
                    }}
                    onPress={() =>
                      this.props.navigation.navigate('EditGeneral', {
                        user_id: this.props.state.id,
                        currentDescription: this.state.description,
                        token: this.props.state.token,
                      })
                    }>
                    <Icon
                      type={'font-awesome-5'}
                      name={'pen'}
                      size={15}
                      style={IconStyle}
                    />
                  </Pressable>
                )}
              </Card.Title>
              <Card.Divider />
              <Text>Last name: {this.state.description.last_name}</Text>
              <Text>
                Gender: {this.state.description.gender ?? 'undefined'}
              </Text>
              <Text>Age: {this.state.description.age}</Text>
              <Text>
                Birth date: {this.state.description.birth_date?.split('T')[0]}
              </Text>
              <Text>Country: {this.state.description.country}</Text>
              <Text>Address: {this.state.description.address}</Text>
              <Text style={TextStyles[1]}>Description</Text>
              <Card.Divider />
              <Text style={TextStyles[1]}>
                {this.state.description.description}
              </Text>
            </Card>
          </View>
        )}
      </ScrollView>
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

const IconStyle: TextStyle | ViewStyle | undefined = {
  paddingLeft: 15,
};

export default connector(Profile);
