import React from 'react';
import {Pressable, TextStyle} from 'react-native';
import toast from 'react-native-toast-message';
import {Text, Input} from 'react-native-elements';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../custom_types/navigation_types';
import {SubmitButton} from '../components';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import {connect, ConnectedProps} from 'react-redux';

import type {Session} from '../store/session-store/types';
import type {RootReducerType as CombinedState} from '../store/rootReducer';

type LoginPageScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;


const mapDispatchToProps = {
  reduxSaveSession: (data: Session) => ({
    type: 'SAVE_SESSION_DATA',
    data: data,
  }),
};

const mapStateToProps = (state: CombinedState) => ({
  sessionActive: state.session.session.sessionActive,
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: LoginPageScreenNavigationProp;
};

type State = {
  email: string;
  password: string;
};

class LoginPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidMount() {
    if (this.props.sessionActive) {
      this.props.navigation.navigate('ModalStack', {
        screen: 'TabNavigator',
        params: {screen: 'Feed'},
      });
    }
  }

  submitLogin = async () => {
    let form = new FormData();
    form.append('email', this.state.email.toLowerCase());
    form.append('password', this.state.password);
    try {
      const response = await axios.post('/users/user/auth/verify', form);
      this.props.reduxSaveSession({
        id: response.data.content.user_id,
        name: response.data.content.name,
        sessionActive: true,
        token: response.data.content.token,
      });
      this.props.navigation.navigate('ModalStack', {
        screen: 'TabNavigator',
        params: {screen: 'Feed'},
      });
    } catch (err) {
      console.error(err);
      toast.show({
        type: 'error',
        text1: err.response.data.content,
        autoHide: true,
        position: 'bottom',
      });
    }
  };

  render() {
    return (
      <ScrollView>
        <Text style={textStyles[1]}>ConnectedIn</Text>
        <Input
          placeholder={'Email...'}
          label={'Email'}
          onChangeText={text =>
            this.setState({
              ...this.state,
              email: text,
            })
          }
        />
        <Input
          onChangeText={text =>
            this.setState({
              ...this.state,
              password: text,
            })
          }
          secureTextEntry={true}
          label={'Password'}
          placeholder={'Password...'}
        />
        <SubmitButton title={'Login'} onPress={this.submitLogin} />
        <Pressable
          android_ripple={{
            color: 'gray',
          }}
          onPress={() => this.props.navigation.navigate('Register_1')}>
          <Text style={textStyles[0]}>Not registered?</Text>
        </Pressable>

      </ScrollView>
    );
  }
}

const textStyles: TextStyle[] = [
  {
    color: '#3282b8',
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'underline',
    paddingLeft: 10,
    paddingTop: 15,
  },

  {
    color: 'black',
    alignSelf: 'center',
    fontSize: 40,
    paddingTop: 50,
    paddingBottom: 50,
    fontWeight: 'bold',
  },
];

export default connector(LoginPage);
