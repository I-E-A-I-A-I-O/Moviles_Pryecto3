import React from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import {Input, Text} from 'react-native-elements';
import SubmitButton from '../components';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import type {ModalStackParamList} from '../custom_types/navigation_types';

type EditExperienceRouteProp = RouteProp<ModalStackParamList, 'EditGeneral'>;
type EditExperienceNavProp = StackNavigationProp<
  ModalStackParamList,
  'EditGeneral'
>;

type Props = {
  route: EditExperienceRouteProp;
  navigation: EditExperienceNavProp;
};

const EditExperience = (props: Props) => {
  return (
    <ScrollView>
      <Text>asdasdasd</Text>
    </ScrollView>
  );
};

export default EditExperience;
