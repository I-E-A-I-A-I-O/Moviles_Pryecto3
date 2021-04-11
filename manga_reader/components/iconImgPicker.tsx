import React from 'react';
import {ViewStyle, Pressable} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
} from 'react-native-image-picker';

const cameraVideoOptions: CameraOptions = {
  mediaType: 'video',
  videoQuality: 'high',
  durationLimit: 120,
};
const cameraPhotoOptions: CameraOptions = {
  mediaType: 'photo',
  quality: 0.5,
};
const libraryPhotoOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.5,
};
const libraryVideoOptions: ImageLibraryOptions = {
  mediaType: 'video',
  videoQuality: 'low',
};

type Props = {
  iconStyle?: ViewStyle;
  type: 'image' | 'video' | 'file-video' | 'file-image';
  onInput: (type: 'video' | 'photo', uri?: string, mime?: string) => void;
  disabled?: boolean;
};

const IconImgPicker = (props: Props) => {
  const onPress = () => {
    if (props.disabled) {
      return;
    }
    switch (props.type) {
      case 'file-image': {
        launchImageLibrary(libraryPhotoOptions, response => {
          if (!response.didCancel) {
            const mime = `image/${response.fileName?.split('.')[1]}`;
            props.onInput('photo', response.uri, mime);
          }
        });
        break;
      }
      case 'file-video': {
        launchImageLibrary(libraryVideoOptions, response => {
          if (!response.didCancel) {
            const mime = `video/${response.fileName?.split('.')[1]}`;
            props.onInput('video', response.uri, mime);
          }
        });
        break;
      }
      case 'image': {
        launchCamera(cameraPhotoOptions, response => {
          if (!response.didCancel) {
            const mime = `image/${response.fileName?.split('.')[1]}`;
            props.onInput('photo', response.uri, mime);
          }
        });
        break;
      }
      case 'video': {
        launchCamera(cameraVideoOptions, response => {
          if (!response.didCancel) {
            const mime = `video/${response.fileName?.split('.')[1]}`;
            props.onInput('video', response.uri, mime);
          }
        });
        break;
      }
    }
  };

  return (
    <>
      <Pressable
        onPress={onPress}
        android_ripple={{
          color: 'gray',
          borderless: true,
        }}>
        <Icon
          style={props.iconStyle}
          type={'font-awesome-5'}
          name={props.type}
        />
      </Pressable>
    </>
  );
};

export default IconImgPicker;
