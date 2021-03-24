import React, {useRef, useState} from 'react';
import {View} from 'react-native';
import {Input, Button, Text} from 'react-native-elements';
import PhoneInput from 'react-native-phone-input';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const RegisterPage = () => {
  const phoneInput = useRef<PhoneInput>(null);
  const [phoneNumber, setPhoneNumber] = useState('13178675309');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const isEmailValid = (emailToVerify: string): boolean => {
    const expression: RegExp = /(?!.*\.{2})^([a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(emailToVerify).toLowerCase());
  };

  const validateFields = (): string | null => {
    if (!phoneInput.current?.isValidNumber()) {
      return 'Invalid phone number!';
    }
    if (!(name.length > 0 && name.length <= 20)) {
      return 'Name must be between 1 and 20 characters!';
    }
    if (!isEmailValid(email)) {
      return 'Email is not valid!';
    }
    return null;
  };

  const completePart1 = async () => {
    let errorMessage = validateFields();
    if (!errorMessage) {
      let form = new FormData();
      form.append('name', name);
      form.append('email', email);
      form.append('phone', phoneNumber);
      try {
        const response = await axios.post('/users/', form);
        Toast.show({
          type: 'success',
          text1: response.data.content,
          autoHide: true,
          position: 'bottom',
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
      <Text
        h3
        h3Style={{
          alignSelf: 'center',
          paddingBottom: 25,
          paddingTop: 25,
        }}
        selectable={false}>
        Create a new account
      </Text>
      <Input
        label={'Name'}
        placeholder={'Your name'}
        textContentType={'username'}
        onChangeText={text => setName(text)}
      />
      <Input
        label={'Email'}
        placeholder={'Your email'}
        textContentType={'emailAddress'}
        keyboardType={'email-address'}
        onChangeText={text => setEmail(text)}
      />
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 15,
          color: 'gray',
          paddingLeft: 12,
          paddingBottom: 5,
        }}>
        Phone number
      </Text>
      <PhoneInput
        initialCountry={'us'}
        textStyle={{
          color: 'black',
        }}
        style={{
          paddingBottom: 25,
        }}
        value={phoneNumber}
        onChangePhoneNumber={text => setPhoneNumber(text)}
        ref={phoneInput}
      />
      <Button title={'Continue'} onPress={completePart1} />
    </View>
  );
};

export default RegisterPage;
