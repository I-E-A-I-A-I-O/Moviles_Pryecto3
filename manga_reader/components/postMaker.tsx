import React, {useState} from 'react';
import {
  View,
  ImageStyle,
  ViewStyle,
  TextStyle,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {Input, Icon, Image} from 'react-native-elements';
import {urlExtractor, IconImgPicker} from '../components';
import {connect, ConnectedProps} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import axios, {Method} from 'axios';
import Video from 'react-native-video';
import Toast from 'react-native-toast-message';

import type {RootReducerType as CombinedState} from '../store/rootReducer';

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  style?: ViewStyle;
  comment?: boolean;
  post_id?: string;
  text?: string;
  edit?: boolean;
};

const PostMaker = (props: Props) => {
  const [uriInput, setUriInput] = useState<string | undefined>();
  const [textInput, setTextInput] = useState(
    props.edit ? (props.text ? props.text : '') : '',
  );
  const [fileSysInput, setFileSysInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState<'video' | 'photo'>('photo');
  const [fileMime, setFileMime] = useState<string | undefined>();

  const setURLImg = () => {
    if (!fileSysInput && !loading) {
      const url = urlExtractor.getFirstURL(textInput);
      if (url && url !== uriInput) {
        setUriInput(url);
      } else if (!url) {
        setUriInput(undefined);
      }
    }
  };

  const _onChangeText = (text: string) => {
    setTextInput(text);
    setURLImg();
  };

  const onFileInput = (
    type: 'video' | 'photo',
    uri?: string,
    mime?: string,
  ) => {
    setLoading(true);
    setTimeout(() => {
      setFileSysInput(true);
      setMediaType(type);
      setFileMime(mime);
      setUriInput(uri);
      setLoading(false);
    }, 2500);
  };

  const onPressDelete = () => {
    if (!loading) {
      setUriInput(undefined);
      setFileSysInput(false);
      setMediaType('photo');
      setURLImg();
    }
  };

  const onSubmit = async () => {
    if (!uriInput && textInput.length === 0) {
      return;
    }
    setLoading(true);
    const form = new FormData();
    try {
      form.append('text', textInput);
      if (uriInput) {
        form.append('postMedia', {
          type: fileMime ? fileMime : 'image/jpeg',
          name: `media.${fileMime ? fileMime?.split('/')[1] : 'jpeg'}`,
          uri: uriInput,
        });
      }
      let reqURL: string;
      let method: Method;
      if (props.comment) {
        reqURL = `/posts/post/${props.post_id}/comment`;
        method = 'POST';
      } else if (props.edit) {
        reqURL = `/posts/post/${props.post_id}`;
        method = 'PUT';
        form.append('post_id', props.post_id);
      } else {
        reqURL = '/posts/post';
        method = 'POST';
      }
      await axios.request({
        url: reqURL,
        method: method,
        headers: {authorization: props.token},
        data: form,
      });
      setFileMime(undefined);
      setFileSysInput(false);
      setUriInput(undefined);
      setMediaType('photo');
      setTextInput('');
      Toast.show({
        type: 'success',
        text1: props.edit ? 'Post edited!' : 'Post created!',
        position: 'bottom',
      });
    } catch (err) {
      Toast.show({
        text1: 'Error creating the post. Try again later',
        type: 'error',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <Input
        multiline
        maxLength={150}
        value={textInput}
        onChangeText={_onChangeText}
        placeholder={'Post something'}
        rightIcon={
          <>
            {loading ? (
              <ActivityIndicator color={'lime'} />
            ) : (
              <Pressable
                onPress={onSubmit}
                android_ripple={{color: 'gray', borderless: true}}>
                <Icon type={'font-awesome-5'} name={'paper-plane'} />
              </Pressable>
            )}
          </>
        }
      />
      <View style={iconContainer}>
        <IconImgPicker
          disabled={loading}
          type={'file-image'}
          iconStyle={iconStyle}
          onInput={onFileInput}
        />
        <IconImgPicker
          disabled={loading}
          type={'image'}
          iconStyle={iconStyle}
          onInput={onFileInput}
        />
        <IconImgPicker
          disabled={loading}
          type={'video'}
          iconStyle={iconStyle}
          onInput={onFileInput}
        />
        {fileSysInput ? (
          <Pressable android_ripple={{color: 'gray'}} onPress={onPressDelete}>
            <Icon
              type={'font-awesome-5'}
              style={iconStyle}
              name={'times-circle'}
            />
          </Pressable>
        ) : null}
      </View>
      {mediaType === 'photo' ? (
        <Image
          style={imageStyle}
          source={{
            uri: uriInput,
            headers: {Range: 'bytes=0-'},
          }}
        />
      ) : (
        <Video
          source={{uri: uriInput, headers: {Range: 'bytes=0-'}}}
          controls
          style={videoStyle}
        />
      )}
    </ScrollView>
  );
};

const imageStyle: ImageStyle = {
  alignSelf: 'center',
  width: '100%',
  height: 500,
  borderRadius: 15,
  resizeMode: 'contain',
  marginTop: 25,
};
const iconContainer: ViewStyle = {
  display: 'flex',
  flex: 1,
  flexDirection: 'row',
};
const iconStyle: TextStyle = {
  paddingLeft: 10,
};
const videoStyle: ViewStyle = {
  alignItems: 'center',
  alignContent: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 300,
  borderRadius: 15,
  backgroundColor: 'gray',
  display: 'flex',
  flex: 1,
  marginTop: 25,
  marginBottom: 25,
};

export default connector(PostMaker);
