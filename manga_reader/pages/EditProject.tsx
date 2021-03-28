import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import {Input} from 'react-native-elements';
import {SubmitButton} from '../components';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import type {ModalStackParamList} from '../custom_types/navigation_types';

type EditAwardRouteProp = RouteProp<ModalStackParamList, 'ProjectEdition'>;
type EditAwardNavProp = StackNavigationProp<
  ModalStackParamList,
  'ProjectEdition'
>;

type Props = {
  route: EditAwardRouteProp;
  navigation: EditAwardNavProp;
};

const EditProject = (props: Props) => {
  const [link, setLink] = useState<string | undefined>(
    props.route.params.currentData?.link,
  );
  const [title, setTitle] = useState<string>(
    props.route.params.currentData?.name ?? '',
  );
  const [description, setDescription] = useState<string | undefined>(
    props.route.params.currentData?.description ?? '',
  );

  const validate = async () => {
    try {
      if (!title || title.length < 1) {
        throw 'Title missing';
      }
      await saveChanges();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err,
        position: 'bottom',
      });
    }
  };

  const saveChanges = async () => {
    try {
      const reqBody = {
        title: title,
        description: description,
        link: link,
      };
      const response = await axios.request({
        method: props.route.params.new ? 'POST' : 'PATCH',
        headers: {authorization: props.route.params.token},
        data: reqBody,
        url: props.route.params.new
          ? '/users/user/projects/project'
          : `/users/user/projects/project/${props.route.params.id}`,
      });
      Toast.show({
        type: 'success',
        text1: response.data.content,
        position: 'bottom',
        autoHide: true,
      });
      props.navigation.goBack();
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: err.response.data.content,
        position: 'bottom',
        autoHide: true,
      });
    }
  };

  return (
    <ScrollView>
      <Input
        label={'Title'}
        value={title}
        maxLength={30}
        onChangeText={text => setTitle(text)}
      />
      <Input
        label={'Description'}
        value={description}
        multiline
        maxLength={140}
        onChangeText={text => setDescription(text)}
      />
      <Input
        label={'Link'}
        value={link}
        maxLength={100}
        onChangeText={text => setLink(text)}
      />
      <SubmitButton title={'Save'} onPress={validate} />
    </ScrollView>
  );
};

export default EditProject;
