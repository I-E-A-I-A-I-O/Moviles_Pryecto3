import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ModalStackParamList} from '../custom_types/navigation_types';
import EditGeneralModal from '../pages/ModalStackPages/EditGeneral';
import JobExperienceEdition from '../pages/ModalStackPages/EditExperience';
import Description from '../pages/ModalStackPages/AttributeDescription';
import EditAward from '../pages/ModalStackPages/EditAward';
import EditProject from '../pages/ModalStackPages/EditProject';
import EditEducation from '../pages/ModalStackPages/EditEducation';
import ProfileModal from '../pages/ModalStackPages/ProfileModal';
import DrawerNavigator from './DrawerNavigator';
import PostThread from '../pages/ModalStackPages/PostThread';

const Stack = createStackNavigator<ModalStackParamList>();

const ModalStack = () => {
  return (
    <Stack.Navigator>
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
      <Stack.Screen
        name={'PostThread'}
        options={{title: 'Comments'}}
        component={PostThread}
      />
    </Stack.Navigator>
  );
};

export default ModalStack;
