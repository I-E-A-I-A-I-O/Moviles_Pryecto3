import React, {useState} from 'react';
import {View, ImageStyle, ViewStyle, TextStyle, Pressable} from 'react-native';
import {Input, Icon, Card, Image, Badge, Avatar} from 'react-native-elements';
import {SubmitButton, urlExtractor, IconImgPicker} from '../components';
import {connect, ConnectedProps} from 'react-redux';
import {ScrollView} from 'react-native-gesture-handler';
import axios from 'axios';

import type {RootReducerType as CombinedState} from '../store/rootReducer';

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  style?: ViewStyle;
};

const PostMaker = (props: Props) => {
  const [uriInput, setUriInput] = useState<string | undefined>();
  const [textInput, setTextInput] = useState('');
  const [fileSysInput, setFileSysInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const setURLImg = () => {
    if (!fileSysInput) {
      const url = urlExtractor.getFirstURL(text);
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
    name?: string,
  ) => {
    setLoading(true);
    setTimeout(() => {
      setFileSysInput(true);
      setUriInput(uri);
      setLoading(false);
    }, 2500);
  };

  const onPressDelete = () => {
    setUriInput(undefined);
    setFileSysInput(false);
    setURLImg();
  };

  return (
    <ScrollView>
      <Input
        multiline
        maxLength={150}
        onChangeText={_onChangeText}
        placeholder={'Post something'}
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
      <Image
        style={imageStyle}
        source={{
          uri: uriInput,
        }}
      />
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

export default connector(PostMaker);
