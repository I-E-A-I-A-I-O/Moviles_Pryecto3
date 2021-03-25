import React, {useState} from 'react';
import {Pressable, TextStyle} from 'react-native';
import toast from 'react-native-toast-message';
import {Text, Input} from 'react-native-elements';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../custom_types/navigation_types';
import SubmitButton from '../components/submitButton';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';

type LoginPageScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

type Props = {
  navigation: LoginPageScreenNavigationProp;
};

function LoginPage(props: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitLogin = async () => {
    let form = new FormData();
    form.append('email', email);
    form.append('password', password);
    try {
      await axios.post('/users/user/auth/verify', form);
      console.log('NICE');
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

  return (
    <ScrollView>
      <Text style={textStyles[1]}>ConnectedIn</Text>
      <Input
        placeholder={'Email...'}
        label={'Email'}
        onChangeText={text => setEmail(text)}
      />
      <Input
        onChangeText={text => setPassword(text)}
        secureTextEntry={true}
        label={'Password'}
        placeholder={'Password...'}
      />
      <SubmitButton title={'Login'} onPress={submitLogin} />
      <Pressable
        android_ripple={{
          color: 'gray',
        }}
        onPress={() => props.navigation.navigate('Register_1')}>
        <Text style={textStyles[0]}>Not registered?</Text>
      </Pressable>
    </ScrollView>
  );
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

export default LoginPage;
