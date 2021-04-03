import React, {useState} from 'react';
import {View, Pressable, TextStyle, ViewStyle} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {connect, ConnectedProps} from 'react-redux';
import {Text, Card} from 'react-native-elements';
import axios from 'axios';
import ActionSheet from 'react-native-action-sheet';

import type {AccOptionsNavigatorParamList} from '../../custom_types/navigation_types';
import type {RootReducerType} from '../../store/rootReducer';

const mapDispatchToProps = {
  clearSession: () => ({
    type: 'DELETE_SESSION_DATA',
  }),
};
const mapStateToProps = (state: RootReducerType) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type AccOptionsMenuNavigationProp = StackNavigationProp<
  AccOptionsNavigatorParamList,
  'Menu'
>;
type Props = PropsFromRedux & {
  navigation: AccOptionsMenuNavigationProp;
};

const ActionSheetOptions = ['Yes', 'No'];

const AccountOptionsMenu = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const closeSession = async () => {
    try {
      setLoading(true);
      await axios.delete('/users/user/auth', {
        headers: {authorization: props.token},
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      props.clearSession();
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      await axios.delete('/users/user', {
        headers: {authorization: props.token},
      });
      await axios.delete('/users/user/auth', {
        headers: {authorization: props.token},
      });
    } catch (err) {
    } finally {
      setLoading(false);
      props.clearSession();
    }
  };

  const confirm = () => {
    ActionSheet.showActionSheetWithOptions(
      {
        options: ActionSheetOptions,
        title: 'Delete account',
        message: 'Are you sure?',
      },
      index => {
        if (index !== undefined && index === 0) {
          deleteAccount();
        }
      },
    );
  };

  return (
    <View style={viewStyle}>
      <Pressable
        disabled={loading}
        android_ripple={{
          color: 'gray',
        }}
        onPress={() =>
          props.navigation.navigate('PasswordVerification', {
            redirectTo: 'email',
          })
        }
        style={pressableStyle}>
        <Text style={textStyle}>Email</Text>
        <Card.Divider />
      </Pressable>
      <Pressable
        disabled={loading}
        android_ripple={{
          color: 'gray',
        }}
        onPress={() =>
          props.navigation.navigate('PasswordVerification', {
            redirectTo: 'phone',
          })
        }
        style={pressableStyle}>
        <Text style={textStyle}>Phone</Text>
        <Card.Divider />
      </Pressable>
      <Pressable
        disabled={loading}
        android_ripple={{
          color: 'gray',
        }}
        onPress={() =>
          props.navigation.navigate('PasswordVerification', {
            redirectTo: 'password',
          })
        }
        style={pressableStyle}>
        <Text style={textStyle}>Password</Text>
        <Card.Divider />
      </Pressable>
      <Pressable
        disabled={loading}
        android_ripple={{
          color: 'gray',
        }}
        onPress={closeSession}
        style={pressableStyle}>
        <Text style={textStyle}>Sign out</Text>
        <Card.Divider />
      </Pressable>
      <Pressable
        disabled={loading}
        android_ripple={{
          color: 'gray',
        }}
        onPress={confirm}
        style={pressableStyle}>
        <Text style={redLetters}>Delete account</Text>
        <Card.Divider />
      </Pressable>
    </View>
  );
};

const viewStyle: ViewStyle = {
  display: 'flex',
  flex: 1,
  alignItems: 'center',
};

const pressableStyle: ViewStyle = {
  width: '100%',
};

const textStyle: TextStyle = {
  padding: 25,
  fontSize: 17,
  fontWeight: 'bold',
};

const redLetters: TextStyle = {
  padding: 25,
  fontSize: 17,
  fontWeight: 'bold',
  color: 'red',
};

export default connector(AccountOptionsMenu);
