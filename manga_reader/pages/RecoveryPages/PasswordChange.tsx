import React, {useState} from 'react';
import {View} from 'react-native';
import {SubmitButton} from '../../components';
import {Input} from 'react-native-elements';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

import type {RootStackParamList} from '../../custom_types/navigation_types';

type PasswordChangePageNavProp = StackNavigationProp<
  RootStackParamList,
  'Recovery_2'
>;
type PasswordChangePageRouteProp = RouteProp<RootStackParamList, 'Recovery_2'>;
type Props = {
  navigation: PasswordChangePageNavProp;
  route: PasswordChangePageRouteProp;
};

const PasswordChange = (props: Props) => {
  const [password, setPassword] = useState('');
  const [verify, setVerify] = useState('');

  const validateFields = (): string | null => {
    if (password !== verify) {
      return 'Passwords do not match.';
    }
    if (!(password.length >= 3 && password.length <= 30)) {
      return 'Password must be from 3 to 30 characters';
    }
    return null;
  };

  const submit = async () => {
    const errMsg = validateFields();
    if (!errMsg) {
      try {
        let form = new FormData();
        form.append('email', props.route.params.email);
        form.append('password', password);
        const response = await axios.put('/users/user/recovery/password', form);
        Toast.show({
          type: 'success',
          text1: response.data.content,
          position: 'bottom',
        });
        props.navigation.popToTop();
      } catch (err) {
        console.error(err);
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
      <Input
        label={'New password'}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Input
        label={'Confirm password'}
        secureTextEntry
        onChangeText={setVerify}
      />
      <SubmitButton title={'Update password'} onPress={submit} />
    </View>
  );
};

export default PasswordChange;
