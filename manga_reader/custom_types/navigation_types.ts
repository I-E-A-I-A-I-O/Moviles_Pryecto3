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
  Profile: {
    deviceUser: boolean;
    user_id: string | undefined;
  };
};

export type RootTabNavigatorParamList = {
  Feed: undefined;
  Profile: {
    deviceUser: boolean;
    user_id: string | undefined;
  };
};
