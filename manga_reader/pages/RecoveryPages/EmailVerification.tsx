import React, {useState} from 'react';
import {Input} from 'react-native-elements';
import {View} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {SubmitButton} from '../../components';

import type {RootStackParamList} from '../../custom_types/navigation_types';
import axios from 'axios';
import Toast from 'react-native-toast-message';

type EmailVerifyNavProp = StackNavigationProp<RootStackParamList, 'Recovery_1'>;
type Props = {
  navigation: EmailVerifyNavProp;
};

const EmailVerifyPage = (props: Props) => {
  const [email, setEmail] = useState('');

  const isEmailValid = (emailToVerify: string): boolean => {
    const expression: RegExp = /(?!.*\.{2})^([a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(emailToVerify).toLowerCase());
  };

  const validateFields = (): string | null => {
    if (!isEmailValid(email)) {
      return 'Email is not valid!';
    }
    return null;
  };

  const verifyEmail = async () => {
    let errorMessage = validateFields();
    if (!errorMessage) {
      let form = new FormData();
      form.append('email', email.toLocaleLowerCase());
      form.append('verification', 'recovery');
      try {
        const response = await axios.post('/verification-codes/code', form);
        props.navigation.navigate('Register_2', {
          verification_id: response.data.content,
          email: email.toLocaleLowerCase(),
          redirectTo: 'Recovery2',
        });
      } catch (err) {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: err.response.data.content,
          autoHide: true,
          position: 'bottom',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: errorMessage,
        autoHide: true,
        position: 'bottom',
      });
    }
  };

  return (
    <View>
      <Input
        label={'Email'}
        value={email}
        placeholder={'Email...'}
        keyboardType={'email-address'}
        textContentType={'emailAddress'}
        autoCompleteType={'email'}
        onChangeText={setEmail}
      />
      <SubmitButton title={'Continue'} onPress={verifyEmail} />
    </View>
  );
};

export default EmailVerifyPage;
