import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  Register_1: undefined;
  Register_2: {
    verification_id: string;
    name: string;
    email: string;
    phone: string;
  };
  Register_3: {
    name: string;
    email: string;
    phone: string;
  };
  Login: undefined;
  ModalStack: NavigatorScreenParams<ModalStackParamList>;
};

export type ModalStackParamList = {
  TabNavigator: NavigatorScreenParams<RootTabNavigatorParamList>;
  ProfileModal: {
    deviceUser: boolean;
    user_id: string | undefined;
  };
  EditGeneral: {
    token: string;
    currentDescription?: {
      description?: string;
      country?: string;
      address?: string;
      gender?: string;
      age?: number;
      last_name?: string;
      birth_date?: string;
    };
  };
  JobExperienceEdition: {
    token: string;
    new: boolean;
    currentData?: {
      organization: string;
      description?: string;
      title: string;
      start: string;
      end: string;
    };
    id?: string;
  };
  AwardEdition: {
    token: string;
    new: boolean;
    currentData?: {
      description?: string;
      title: string;
      by: string;
      date: string;
    };
    id?: string;
  };
  ProjectEdition: {
    token: string;
    new: boolean;
    currentData?: {
      description?: string;
      name: string;
      link?: string;
    };
    id?: string;
  };
  EducationEdition: {
    token: string;
    new: boolean;
    currentData?: {
      school: string;
      title: string;
      start: string;
      graduation: string;
    };
    id?: string;
  };
  UserAttributeDescription: {
    id: string;
    type: 'job' | 'award' | 'education' | 'project';
    deviceUser: boolean;
    token: string;
  };
};

export type RootTabNavigatorParamList = {
  Dashboard: undefined;
  Notifications: undefined;
  Post: undefined;
};
