import React from 'react';
import {Alert, Pressable, TextStyle, View, ViewStyle} from 'react-native';
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

import type {RootReducerType as CombinedState} from '../store/rootReducer';
import axios from 'axios';

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
    age: string | undefined;
    last_name: string | undefined;
    birth_date: string | undefined;
  };
  abilities: string[];
  awards: {name: string; id: string}[];
  education: {title: string; id: string}[];
  experience: {title: string; id: string}[];
  projects: {name: string; id: string}[];
  recommended_by: string[];
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

  componentDidMount() {
    /*axios
      .get(
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
      )
      .then(response => {
        this.setState({
          ...this.state,
          abilities: response.data.abilities,
          awards: response.data.abilites,
          description: response.data.description ?? initialState.description,
          education: response.data.education,
          experience: response.data.experience,
          projects: response.data.projects,
          recommended_by: response.data.recent_posts,
        });
      })
      .catch(err => {
        console.error(err.response.data);
      });*/
  }

  render() {
    return (
      <ScrollView>
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
                  })
                }>
                <Icon
                  type={'font-awesome-5'}
                  name={'pen'}
                  size={15}
                  style={{paddingLeft: 15}}
                />
              </Pressable>
            )}
          </Card.Title>
          <Card.Divider />
          <Text>Last name: {this.state.description.last_name}</Text>
          <Text>Gender: {this.state.description.gender ?? 'undefined'}</Text>
          <Text>Age: {this.state.description.age}</Text>
          <Text>Birth date: {this.state.description.birth_date}</Text>
          <Text>Country: {this.state.description.country}</Text>
          <Text>Address: {this.state.description.address}</Text>
        </Card>
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
];

export default connector(Profile);
