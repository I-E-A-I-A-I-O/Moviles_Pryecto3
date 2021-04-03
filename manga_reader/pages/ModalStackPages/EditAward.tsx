import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import {Input} from 'react-native-elements';
import {SubmitButton, dateFunctions} from '../../components';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import type {ModalStackParamList} from '../../custom_types/navigation_types';

type EditAwardRouteProp = RouteProp<ModalStackParamList, 'AwardEdition'>;
type EditAwardNavProp = StackNavigationProp<
  ModalStackParamList,
  'AwardEdition'
>;

type Props = {
  route: EditAwardRouteProp;
  navigation: EditAwardNavProp;
};

const EditAward = (props: Props) => {
  const [date, setDate] = useState<string | undefined>(
    props.route.params.currentData?.date,
  );
  const [by, setBy] = useState<string>(
    props.route.params.currentData?.by ?? '',
  );
  const [title, setTitle] = useState<string>(
    props.route.params.currentData?.title ?? '',
  );
  const [description, setDescription] = useState<string | undefined>(
    props.route.params.currentData?.description ?? '',
  );

  const validate = async () => {
    try {
      if (!by || by.length < 1) {
        throw 'Organization name missing';
      }
      if (!title || title.length < 1) {
        throw 'Title missing';
      }
      if (
        !dateFunctions.isDateValid(
          date ?? '',
          new Date(Date.now()).getFullYear() - 50,
          new Date(Date.now()).getFullYear(),
        )
      ) {
        throw 'Invalid date!';
      }
      if (
        !dateFunctions.isBeforeThan(
          date ?? '',
          new Date(Date.now()).toISOString().split('T')[0],
        )
      ) {
        throw 'Invalid date!';
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
        by: by,
        title: title,
        description: description,
        date: date,
      };
      const response = await axios.request({
        method: props.route.params.new ? 'POST' : 'PATCH',
        headers: {authorization: props.route.params.token},
        data: reqBody,
        url: props.route.params.new
          ? '/users/user/awards/award'
          : `/users/user/awards/award/${props.route.params.id}`,
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
        label={'Awarded by'}
        value={by}
        maxLength={25}
        onChangeText={text => setBy(text)}
      />
      <Input
        label={'Date'}
        value={date}
        placeholder={'YYYY-MM-DD'}
        keyboardType={'phone-pad'}
        onChangeText={setDate}
      />
      <SubmitButton title={'Save'} onPress={validate} />
    </ScrollView>
  );
};

export default EditAward;
