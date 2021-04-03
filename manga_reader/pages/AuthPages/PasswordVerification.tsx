import React, {useState} from 'react';
import {View, TextStyle} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {Input, Text} from 'react-native-elements';
import {connect, ConnectedProps} from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {SubmitButton} from '../../components';

import type {RootReducerType as CombinedState} from '../../store/rootReducer';
import type {AccOptionsNavigatorParamList} from '../../custom_types/navigation_types';

type PasswordVerificationPageNavProp = StackNavigationProp<
  AccOptionsNavigatorParamList,
  'PasswordVerification'
>;
type PasswordVerificationPageRouteProp = RouteProp<
  AccOptionsNavigatorParamList,
  'PasswordVerification'
>;

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  route: PasswordVerificationPageRouteProp;
  navigation: PasswordVerificationPageNavProp;
};

const PasswordVerification = (props: Props) => {
  const [password, setPassword] = useState('');

  const redirect = () => {
    switch (props.route.params.redirectTo) {
      case 'email': {
        props.navigation.navigate('UpdateEmail');
        break;
      }
      case 'password': {
        props.navigation.navigate('UpdatePassword');
        break;
      }
      case 'phone': {
        props.navigation.navigate('UpdatePhone');
        break;
      }
    }
  };

  const submit = async () => {
    let form = new FormData();
    form.append('password', password);
    try {
      await axios.post('/users/user/credentials/password', form, {
        headers: {authorization: props.token},
      });
      redirect();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err.response.data.content,
        position: 'bottom',
      });
    }
  };

  return (
    <View>
      <Text style={textStyle}>Verify your password</Text>
      <Input
        label={'Password'}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <SubmitButton title={'Verify'} onPress={submit} />
    </View>
  );
};

const textStyle: TextStyle = {
  alignSelf: 'center',
  fontWeight: 'bold',
  fontSize: 30,
  marginTop: 30,
  marginBottom: 60,
};

export default connector(PasswordVerification);
