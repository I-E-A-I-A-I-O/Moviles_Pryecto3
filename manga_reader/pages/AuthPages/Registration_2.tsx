import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {View, Pressable, TextStyle} from 'react-native';
import {Input, Text} from 'react-native-elements';
import {RootStackParamList} from '../../custom_types/navigation_types';
import {RouteProp} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {SubmitButton} from '../../components';

type RegisterPart2ScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register_2'
>;

type RegisterPart2RouteProp = RouteProp<RootStackParamList, 'Register_2'>;

type Props = {
  navigation: RegisterPart2ScreenNavigationProp;
  route: RegisterPart2RouteProp;
};

const Registration2 = (props: Props) => {
  const [canAskForCode, setCanAskForCode] = useState(true);
  const [verificationId, setVerificationId] = useState(
    props.route.params.verification_id,
  );
  const [code, setCode] = useState('');

  const askForCode = async () => {
    if (canAskForCode) {
      setCanAskForCode(false);
      setTimeout(() => {
        setCanAskForCode(true);
      }, 30000);
      try {
        Toast.show({
          text1: 'Requesting new code...',
          type: 'info',
          autoHide: true,
          position: 'bottom',
        });
        let response = await axios.put('/verification-codes/code', {
          verification_id: verificationId,
          name: props.route.params.name,
          email: props.route.params.email,
          phone: props.route.params.phone,
          verification:
            props.route.params.redirectTo === 'Register3' ? 'new' : 'recovery',
        });
        setVerificationId(response.data.content);
        Toast.show({
          text1: 'New code sent',
          type: 'success',
          autoHide: true,
          position: 'bottom',
        });
      } catch (err) {
        console.error(err);
        Toast.show({
          text1: 'Error requesting new code',
          type: 'error',
          autoHide: true,
          position: 'bottom',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Wait 30 seconds before requesting a new code',
        position: 'bottom',
        autoHide: true,
      });
    }
  };

  const redirect = () => {
    if (props.route.params.redirectTo === 'Register3') {
      props.navigation.navigate('Register_3', {
        email: props.route.params.email,
        name: props.route.params.name,
        phone: props.route.params.phone,
      });
    } else {
      props.navigation.navigate('Recovery_2', {
        email: props.route.params.email,
      });
    }
  };

  const submitCode = async () => {
    if (code.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid code!',
        autoHide: true,
        position: 'bottom',
      });
    } else {
      try {
        await axios.put('/verification-codes/code/verify', {
          verification_id: verificationId,
          code: code,
        });
        redirect();
      } catch (err) {
        console.error(err);
        Toast.show({
          text1: err.response.data.content,
          type: 'error',
          autoHide: true,
          position: 'bottom',
        });
      }
    }
  };

  return (
    <View>
      <Text style={styles[0]}>Email verification</Text>
      <Text style={styles[1]}>
        A verification code has been sent to the provided email address
      </Text>
      <Input
        label={'Verification code'}
        keyboardType={'default'}
        textContentType={'oneTimeCode'}
        onChangeText={text => setCode(text)}
      />
      <SubmitButton title={'Verify'} onPress={submitCode} />
      <Pressable
        onPress={askForCode}
        android_ripple={{
          color: 'gray',
          borderless: false,
        }}>
        <Text style={styles[2]}>Request a new code</Text>
      </Pressable>
    </View>
  );
};

const styles: TextStyle[] = [
  {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 15,
  },
  {
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 15,
    paddingBottom: 15,
    paddingTop: 15,
  },
  {
    paddingTop: 15,
    paddingLeft: 5,
    color: 'blue',
    textDecorationLine: 'underline',
  },
];

export default Registration2;
