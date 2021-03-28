import React from 'react';
import {Pressable, View, ViewStyle} from 'react-native';
import {Avatar} from 'react-native-elements';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
} from 'react-native-image-picker';
import ActionSheet from 'react-native-action-sheet';
import axios from 'axios';
import Toast from 'react-native-toast-message';

type Props = {
  user_id: string;
  token: string;
};

type State = {
  type: string;
  imgUri: string;
  canSave: boolean;
  avatar: string | undefined;
};

class AvatarImagePicker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      imgUri:
        'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
      type: '',
      canSave: false,
      avatar: '',
    };
  }

  private options = ['Camera', 'Files'];
  private launchOptions: CameraOptions = {
    mediaType: 'photo',
    quality: 1,
    includeBase64: true,
  };

  componentDidMount() {
    axios.get(`/users/user/${this.props.user_id}/avatar`).then(response => {
      this.setState({
        ...this.state,
        imgUri: response.data,
      });
    });
  }

  saveAvatar = async () => {
    try {
      this.setState({
        ...this.state,
        canSave: false,
      });
      let form = new FormData();
      form.append('avatar', {
        type: `image/${this.state.type}`,
        name: `avatar.${this.state.type}`,
        uri: this.state.avatar,
      });
      const response = await axios.put('/users/user/avatar', form, {
        headers: {authorization: this.props.token},
      });
      Toast.show({
        text1: response.data.content,
        type: 'success',
        position: 'bottom',
      });
    } catch (err) {
      Toast.show({
        text1: err.response.data.content,
        type: 'error',
        position: 'bottom',
      });
    } finally {
      this.setState({
        ...this.state,
        canSave: true,
      });
    }
  };

  render() {
    return (
      <View style={viewStyle[0]}>
        <Pressable
          android_ripple={{
            color: 'gray',
            borderless: true,
          }}
          onLongPress={() => {
            ActionSheet.showActionSheetWithOptions(
              {
                options: this.options,
                title: 'Image source',
              },
              input => {
                if (input !== undefined) {
                  if (input === 0) {
                    launchCamera(this.launchOptions, fileInput => {
                      if (!fileInput.didCancel) {
                        this.setState({
                          ...this.state,
                          imgUri: `data:image/jpg;base64,${fileInput.base64}`,
                          type: 'jpg',
                          avatar: fileInput.uri,
                          canSave: true,
                        });
                      }
                    });
                  } else {
                    launchImageLibrary(this.launchOptions, fileInput => {
                      if (!fileInput.didCancel) {
                        let fileType = fileInput.fileName?.split('.')[1];
                        let mimeType = `image/${fileType}`;
                        this.setState({
                          ...this.state,
                          imgUri: `data:${mimeType};base64,${fileInput.base64}`,
                          type: fileType ? fileType : 'jpg',
                          avatar: fileInput.uri,
                          canSave: true,
                        });
                      }
                    });
                  }
                }
              },
            );
          }}>
          <Avatar
            source={{
              uri: this.state.imgUri,
            }}
            rounded
            size={'xlarge'}>
            <Avatar.Accessory
              name={'save'}
              type={'font-awesome-5'}
              size={50}
              color={this.state.canSave ? 'lime' : 'black'}
              onPress={this.saveAvatar}
              disabled={!this.state.canSave}
            />
          </Avatar>
        </Pressable>
      </View>
    );
  }
}

const viewStyle: ViewStyle[] = [
  {alignSelf: 'center'},
  {alignSelf: 'flex-start'},
];

export default AvatarImagePicker;
