import React from 'react';
import {TextStyle, Pressable, View, ViewStyle} from 'react-native';
import {Input, Icon, Card} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
  RootTabNavigatorParamList,
  ModalStackParamList,
} from '../custom_types/navigation_types';
import {CompositeNavigationProp} from '@react-navigation/native';
import {connect, ConnectedProps} from 'react-redux';
import {ModalDropdown, UserAvatar} from '../components';

import type {RootReducerType as CombinedState} from '../store/rootReducer';
import type {SearchBarFilters} from '../custom_types/state_types';

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

const options: SearchBarFilters = {
  searchOptions: [
    {label: 'People', value: 'persons'},
    {label: 'Jobs', value: 'jobs'},
    {label: 'Posts', value: 'posts'},
    {label: 'Organizations', value: 'organizations'},
  ],
  scope: [
    {label: 'Global', value: 'global'},
    {label: 'Connections', value: 'connections'},
  ],
};

type State = {
  searchOption: string;
  scope: string;
};

class Dashboard extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {scope: 'global', searchOption: 'persons'};
  }

  render() {
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
                this.props.navigation.navigate('ProfileModal', {
                  deviceUser: true,
                  name: this.props.state.name,
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
      </ScrollView>
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
