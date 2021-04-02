import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import {Input} from 'react-native-elements';
import {SubmitButton, dateFunctions} from '../components';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import type {ModalStackParamList} from '../custom_types/navigation_types';

type EditExperienceRouteProp = RouteProp<
  ModalStackParamList,
  'JobExperienceEdition'
>;
type EditExperienceNavProp = StackNavigationProp<
  ModalStackParamList,
  'JobExperienceEdition'
>;

type Props = {
  route: EditExperienceRouteProp;
  navigation: EditExperienceNavProp;
};

const EditExperience = (props: Props) => {
  const [startDate, setStartDate] = useState<string | undefined>(
    props.route.params.currentData?.start,
  );
  const [finishDate, setFinishDate] = useState<string | undefined>(
    props.route.params.currentData?.end,
  );
  const [orgName, setOrgname] = useState<string>(
    props.route.params.currentData?.organization ?? '',
  );
  const [title, setTitle] = useState<string>(
    props.route.params.currentData?.title ?? '',
  );
  const [description, setDescription] = useState<string | undefined>(
    props.route.params.currentData?.description ?? '',
  );

  const validate = async () => {
    try {
      if (!orgName || orgName.length < 1) {
        throw 'Organization name missing';
      }
      if (!title || title.length < 1) {
        throw 'Job title missing';
      }
      if (
        !dateFunctions.isDateValid(
          startDate ?? '',
          new Date(Date.now()).getFullYear() - 50,
          new Date(Date.now()).getFullYear(),
        )
      ) {
        throw 'Invalid date!';
      }
      if (
        !dateFunctions.isDateValid(
          finishDate ?? '',
          dateFunctions.getNumbers(startDate ?? '')?.year,
          new Date(Date.now()).getFullYear() + 50,
        )
      ) {
        throw 'Invalid date!';
      }
      if (!dateFunctions.isBeforeThan(startDate ?? '', finishDate ?? '')) {
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
        org_name: orgName,
        title: title,
        description: description,
        startDate: startDate,
        finishDate: finishDate,
      };
      const response = await axios.request({
        method: props.route.params.new ? 'POST' : 'PATCH',
        headers: {authorization: props.route.params.token},
        data: reqBody,
        url: props.route.params.new
          ? '/users/user/jobs/job'
          : `/users/user/jobs/job/${props.route.params.id}`,
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
        label={'Organization'}
        value={orgName}
        maxLength={30}
        onChangeText={text => setOrgname(text)}
      />
      <Input
        label={'Job title'}
        value={title}
        maxLength={25}
        onChangeText={text => setTitle(text)}
      />
      <Input
        label={'Job description'}
        multiline
        value={description}
        maxLength={140}
        onChangeText={text => setDescription(text)}
      />
      <Input
        label={'Start date'}
        value={startDate}
        placeholder={'YYYY-MM-DD'}
        keyboardType={'phone-pad'}
        onChangeText={setStartDate}
      />
      <Input
        label={'Finish date'}
        value={finishDate}
        onChangeText={setFinishDate}
        placeholder={'YYYY-MM-DD'}
        keyboardType={'phone-pad'}
      />
      <SubmitButton title={'Save'} onPress={validate} />
    </ScrollView>
  );
};

export default EditExperience;
