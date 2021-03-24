import React, {useState} from 'react';
import {ActivityIndicator, ImageStyle} from 'react-native';
import {Card} from 'react-native-elements';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
} from 'react-native-image-picker';
import ActionSheet from 'react-native-action-sheet';

type Props = {
  onInput: (imgUri: string | undefined, imgType: string | undefined) => void;
  context: string;
  initialImage: string | null | undefined;
};

function ImagePicker(props: Props) {
  const [type, setType] = useState('jpg');
  const [avatar, setAvatar] = useState(
    props.initialImage
      ? props.initialImage
      : props.context === 'avatar'
      ? 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png'
      : 'https://www.psionline.com/wp-content/uploads/placeholder-icon.png',
  );

  const options = ['Camera', 'Files'];
  const launchOptions: CameraOptions = {
    mediaType: 'photo',
    quality: 1,
    includeBase64: true,
  };

  return (
    <Card.Image
      style={style}
      PlaceholderContent={<ActivityIndicator size={'large'} color={'lime'} />}
      source={{uri: avatar}}
      onPress={() => {
        ActionSheet.showActionSheetWithOptions(
          {
            options: options,
            title: 'Image source',
          },
          input => {
            if (input !== undefined) {
              if (input === 0) {
                launchCamera(launchOptions, fileInput => {
                  if (!fileInput.didCancel) {
                    setAvatar(`data:image/jpg;base64,${fileInput.base64}`);
                    setType('jpg');
                    props.onInput(fileInput.uri, type);
                  }
                });
              } else {
                launchImageLibrary(launchOptions, fileInput => {
                  if (!fileInput.didCancel) {
                    let fileType = fileInput.fileName?.split('.')[1];
                    let mimeType = `image/${fileType}`;
                    setAvatar(`data:${mimeType};base64,${fileInput.base64}`);
                    setType(fileType ? fileType : 'jpg');
                    props.onInput(fileInput.uri, fileType);
                  }
                });
              }
            }
          },
        );
      }}
    />
  );
}

const style: ImageStyle = {
  width: '100%',
  height: 300,
};

export default ImagePicker;
