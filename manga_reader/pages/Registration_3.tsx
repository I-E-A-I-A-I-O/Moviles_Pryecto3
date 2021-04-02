import React, {useState} from 'react';
import {ScrollView, TextStyle} from 'react-native';
import {Text, Input} from 'react-native-elements';
import {SubmitButton, ImagePicker} from '../components';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../custom_types/navigation_types';
import Toast from 'react-native-toast-message';
import axios from 'axios';

type RegisterPage3NavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register_3'
>;
type RegisterPage3RouteProp = RouteProp<RootStackParamList, 'Register_3'>;
type Props = {
  navigation: RegisterPage3NavigationProp;
  route: RegisterPage3RouteProp;
};

const Registration3 = (props: Props) => {
  const [uri, setUri] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState('');

  const _onPickerInput = (
    imgUri: string | undefined,
    imgType: string | undefined,
  ) => {
    setUri(imgUri);
    setType(imgType);
  };

  const submitForm = async () => {
    if (!(password.length > 5 && password.length <= 30)) {
      Toast.show({
        text1: 'Password length: 5 to 30 characters!',
        type: 'error',
        autoHide: true,
        position: 'bottom',
      });
    } else {
      let form = new FormData();
      form.append('name', props.route.params.name);
      form.append('email', props.route.params.email);
      form.append('phone', props.route.params.phone);
      form.append('password', password);
      if (uri) {
        form.append('avatar', {
          type: `image/${type}`,
          name: `avatar.${type}`,
          uri: uri,
        });
      }
      try {
        const response = await axios.post('/users/user', form);
        Toast.show({
          type: 'success',
          text1: response.data.content,
          autoHide: true,
          position: 'bottom',
        });
        props.navigation.popToTop();
      } catch (err) {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: err.response.data.content,
          autoHide: true,
          position: 'bottom',
        });
      }
    }
  };

  return (
    <ScrollView>
      <Text style={textStyles[0]}>Complete registration</Text>
      <ImagePicker
        context={'avatar'}
        onInput={_onPickerInput}
        initialImage={null}
      />
      <Input label={'Name'} value={props.route.params.name} disabled />
      <Input label={'Email'} value={props.route.params.email} disabled />
      <Input label={'Phone number'} value={props.route.params.phone} disabled />
      <Input
        label={'Password'}
        secureTextEntry
        textContentType={'newPassword'}
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <SubmitButton title={'Register'} onPress={submitForm} />
    </ScrollView>
  );
};

const textStyles: TextStyle[] = [
  {
    alignSelf: 'center',
    paddingTop: 15,
    fontWeight: 'bold',
    fontSize: 25,
    paddingBottom: 15,
  },
];

export default Registration3;
