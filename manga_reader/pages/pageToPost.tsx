import React, {useState} from 'react';
import { View, TextInput, Alert} from 'react-native';
import {Text, Card, Icon} from 'react-native-elements';
import {UserAvatar, SubmitButton, AvatarImgPicker} from '../components';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
  RootTabNavigatorParamList,
  ModalStackParamList,
} from '../custom_types/navigation_types';
import {CompositeNavigationProp} from '@react-navigation/native';
import {connect, ConnectedProps} from 'react-redux';
import type {RootReducerType as CombinedState} from '../store/rootReducer';
import { TextStyle } from 'react-native-phone-input';
import Post from '../components/createPost';
import axios from 'axios';
import Toast from 'react-native-toast-message';

type DashboardScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabNavigatorParamList, 'Dashboard'>,
  StackNavigationProp<ModalStackParamList>
>;

const mapStateToProps = (state: CombinedState) => ({
  state: state.session.session,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  navigation: DashboardScreenNavigationProp;
};

/*type State = {
  text: string;
  uri: string | undefined;
  type: string | undefined;
  setUri(imgUri:string): string | undefined;
  setType(imgType: string):string | undefined;
}*/


function pageToPost (props: Props) {
  const [uri, setUri] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [text, setText] = useState('');

 
  const _onPickerInput = (
    imgUri: string | undefined,
    imgType: string | undefined,
  ) => {
      setUri(imgUri);
      setType(imgType);
  };

  const onChangeText = async (e: string) =>{
    setText(e); 
  }

  const dataPost = async () =>{
    if(text.length < 1){
      Toast.show({
        text1: 'Error Text',
        type: 'error',
        autoHide: true,
        position: 'bottom',
      });
    }else{
      let form = new FormData();
      form.append('content', text);
      form.append('date', new Date(Date.now()).toISOString().split('T')[0]);
      if (uri) {
        form.append('file', {
          type: `image/${type}`,
          name: `file.${type}`,
          uri: uri,
        });
      }
      try{
       await axios.post('/post/dataPost',
          form, 
          {
            headers: { 
              'content-type': 'application/x-www-form-urlencoded' ,
              'Content-type':'application/json'
            }
          })   
       Toast.show({
        type: 'success',
        text1: 'text sent correctly',
        autoHide: true,
        position: 'bottom',
      });
      }catch(err){
        console.error(err);
          Toast.show({
            type: 'error',
            text1: 'error por catch',
            autoHide: true,
            position: 'bottom',
          });
      }
    }
  }

    return (
        <View>
            <UserAvatar
              size={'medium'}
              user_id={props.state.id}      
              style={textStyle[0]}      
            />
            <Text style={textStyle[1]} >{props.state.name}</Text>
              <TextInput 
                placeholder={'Comparte Informacion...............'} 
                onChangeText ={ text => onChangeText(text) }
                value={text} 
                style={textStyle[2]}             
              />
            <View style={{left:170, top:35}}>
              <Icon 
                type={'entypo'} 
                name={'publish'} 
                onPress={dataPost} 
                size={35}
              />
            </View>
            <Post
              context={'file'}
              initialFile={undefined}
              onInput={_onPickerInput}
              user_id={props.state.id} 
            />
        </View>
    );

}

const textStyle: TextStyle[]=[
  {
    position: 'absolute',
    top: 40,
    left: 20
  },
  {
    position: 'absolute',
    top: 40,
    left: 100,
    fontSize: 32
  },
  {
    position: 'absolute',
    top: 100,
    left: 20,
    fontSize: 20,
    color: 'black'
  }
];

export default connector(pageToPost);
