import React, {useState, useRef} from 'react';
import {View, TextStyle} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Text} from 'react-native-elements';
import {connect, ConnectedProps} from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {SubmitButton} from '../../components';
import PhoneInput, {
  TextStyle as PITextStyle,
  ViewStyle as PIViewStyle,
} from 'react-native-phone-input';

import type {RootReducerType as CombinedState} from '../../store/rootReducer';
import type {AccOptionsNavigatorParamList} from '../../custom_types/navigation_types';

type PhoneUpdatePageNavProp = StackNavigationProp<
  AccOptionsNavigatorParamList,
  'UpdatePhone'
>;

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  navigation: PhoneUpdatePageNavProp;
};

const PhoneUpdate = (props: Props) => {
  const phoneInput = useRef<PhoneInput>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const submit = async () => {
    if (phoneInput.current?.isValidNumber()) {
      let form = new FormData();
      form.append('phone', phoneNumber);
      try {
        await axios.put('/users/user/credentials/phone', form, {
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
        text1: 'Input a valid phone number',
        position: 'bottom',
      });
    }
  };

  return (
    <View>
      <Text style={textStyle}>Set your new phone number</Text>
      <PhoneInput
        initialCountry={'us'}
        textStyle={phoneInputTextStyle}
        style={phoneInputViewStyle}
        value={phoneNumber}
        onChangePhoneNumber={setPhoneNumber}
        ref={phoneInput}
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

const phoneInputTextStyle: PITextStyle = {
  color: 'black',
};

const phoneInputViewStyle: PIViewStyle = {
  paddingBottom: 25,
};

export default connector(PhoneUpdate);
