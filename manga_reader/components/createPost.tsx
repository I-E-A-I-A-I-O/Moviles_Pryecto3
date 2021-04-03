import React, {useState} from 'react';
import {ActivityIndicator, ImageStyle, View, TextStyle, Alert} from 'react-native';
import {Card, Icon} from 'react-native-elements';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
} from 'react-native-image-picker';
import ActionSheet from 'react-native-action-sheet';

type Props = {
  onInput: (imgUri: string | undefined , imgType: string | undefined ) => void;
  context: string;
  user_id: string;
  initialFile: string | null | undefined;
};

function Post(props: Props) {
  const [type, setType] = useState('jpg');
  const [file, setFile] = useState(
    props.initialFile
      ? props.initialFile
      : props.context === 'file'
      ? 'https://www.psionline.com/wp-content/uploads/placeholder-icon.png'
      : 'https://i.pinimg.com/originals/52/d8/17/52d81745fab90ec4f08e4ab871603e55.jpg',
  );

  const options = ['Camera', 'Files'];
  const launchOptions: CameraOptions = {
    mediaType: 'photo',
    quality: 1,
    includeBase64: true,
  };

  return (
     <View style={{left:-10, top:115}}>
      <Icon
        type={'font-awesome'} 
        name={'camera'} 
        size={35}
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
                      setFile(`data:image/jpg;base64,${fileInput.base64}`);
                      setType('jpg');
                      props.onInput(fileInput.uri, type);
                    }
                  });
                } else {
                  launchImageLibrary(launchOptions, fileInput => {
                    if (!fileInput.didCancel) {
                      let fileType = fileInput.fileName?.split('.')[1];
                      let mimeType = `image/${fileType}`;
                      setFile(`data:${mimeType};base64,${fileInput.base64}`);
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
       <Card.Image 
        style={style}
        source={{uri:file}}
      />
      </View>
  );
}

const style: ImageStyle = {
  width: '80%',
  alignItems: 'center',
  height: 400,
  left: '12.5%',
  top: '2%'
};

export default Post;
