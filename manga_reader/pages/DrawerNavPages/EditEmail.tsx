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

type EmailUpdatePageNavProp = StackNavigationProp<
  AccOptionsNavigatorParamList,
  'UpdateEmail'
>;

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  navigation: EmailUpdatePageNavProp;
};

const EmailUpdate = (props: Props) => {
  const [email, setEmail] = useState('');

  const isEmailValid = (emailToVerify: string): boolean => {
    const expression: RegExp = /(?!.*\.{2})^([a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(emailToVerify).toLowerCase());
  };

  const submit = async () => {
    if (isEmailValid(email)) {
      let form = new FormData();
      form.append('email', email.toLowerCase());
      try {
        await axios.put('/users/user/credentials/email', form, {
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
        text1: 'Input a valid email address.',
        position: 'bottom',
      });
    }
  };

  return (
    <View>
      <Text style={textStyle}>Set your new email</Text>
      <Input
        label={'Email'}
        value={email}
        keyboardType={'email-address'}
        autoCompleteType={'email'}
        textContentType={'emailAddress'}
        onChangeText={setEmail}
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

export default connector(EmailUpdate);
