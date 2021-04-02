import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ModalStackParamList} from '../custom_types/navigation_types';
import RootTabNav from './RootTabNavigator';
import EditGeneralModal from '../pages/EditGeneral';
import JobExperienceEdition from '../pages/EditExperience';
import Description from '../pages/AttributeDescription';
import EditAward from '../pages/EditAward';
import EditProject from '../pages/EditProject';
import EditEducation from '../pages/EditEducation';
import ProfileModal from '../pages/ProfileModal';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator<ModalStackParamList>();

const ModalStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'TabNavigator'}
        options={{headerShown: false}}
        component={RootTabNav}
      />
      <Stack.Screen
        name={'DrawerNavigator'}
        component={DrawerNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'ProfileModal'}
        component={ProfileModal}
        initialParams={{
          deviceUser: false,
          user_id: undefined,
        }}
        options={{title: 'Profile'}}
      />
      <Stack.Screen
        name={'EditGeneral'}
        options={{title: 'Profile edition'}}
        component={EditGeneralModal}
      />
      <Stack.Screen
        name={'JobExperienceEdition'}
        options={{title: 'Job experience'}}
        component={JobExperienceEdition}
      />
      <Stack.Screen
        name={'UserAttributeDescription'}
        options={{title: 'Description'}}
        component={Description}
      />
      <Stack.Screen
        name={'AwardEdition'}
        options={{title: 'Award'}}
        component={EditAward}
      />
      <Stack.Screen
        name={'ProjectEdition'}
        options={{title: 'Project'}}
        component={EditProject}
      />
      <Stack.Screen
        name={'EducationEdition'}
        options={{title: 'Education'}}
        component={EditEducation}
      />
    </Stack.Navigator>
  );
};

export default ModalStack;
