import React, {useState} from 'react';
import {View, TextStyle} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Input, Text} from 'react-native-elements';
import {connect, ConnectedProps} from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {SubmitButton} from '../../components';

import type {RootReducerType as CombinedState} from '../../store/rootReducer';
import type {AccOptionsNavigatorParamList} from '../../custom_types/navigation_types';

type PasswordUpdatePageNavProp = StackNavigationProp<
  AccOptionsNavigatorParamList,
  'UpdatePassword'
>;

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  navigation: PasswordUpdatePageNavProp;
};

const PasswordUpdate = (props: Props) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const validate = (): string | null => {
    if (password !== confirm) {
      return 'Passwords do not match!';
    }
    if (!(password.length >= 3 && password.length <= 30)) {
      return 'Password must be 3 to 30 characters long!';
    }
    return null;
  };

  const submit = async () => {
    const errMsg = validate();
    if (!errMsg) {
      let form = new FormData();
      form.append('newPass', password);
      try {
        await axios.put('/users/user/credentials/password', form, {
          headers: {authorization: props.token},
        });
        Toast.show({
          type: 'success',
          text1: 'Profile updated.',
          position: 'bottom',
        });
        props.navigation.popToTop();
      } catch (err) {
        Toast.show({
          type: 'error',
          text1: err.response.data.content,
          position: 'bottom',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: errMsg,
        position: 'bottom',
      });
    }
  };

  return (
    <View>
      <Text style={textStyle}>Set your new password</Text>
      <Input
        label={'Password'}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Input
        label={'Confirm password'}
        value={confirm}
        secureTextEntry
        onChangeText={setConfirm}
      />
      <SubmitButton title={'Update'} onPress={submit} />
    </View>
  );
};

const textStyle: TextStyle = {
  alignSelf: 'center',
  fontWeight: 'bold',
  fontSize: 26,
  marginTop: 30,
  marginBottom: 60,
};

export default connector(PasswordUpdate);
