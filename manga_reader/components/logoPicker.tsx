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
  logo: string | undefined;
};

class Logo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      imgUri:
        'https://c0.klipartz.com/pngpicture/51/556/gratis-png-cooperativa-cooperativa-de-actividades-y-servicio-de-arte-conclusiones.png',
      type: '',
      canSave: false,
      logo: '',
    };
  }

  private options = ['Camera', 'Files'];
  private launchOptions: CameraOptions = {
    mediaType: 'photo',
    quality: 1,
    includeBase64: true,
  };


  saveLogo = async () => {
    try {
      this.setState({
        ...this.state,
        canSave: false,
      });
      let form = new FormData();
      form.append('logo', {
        type: `image/${this.state.type}`,
        name: `logo.${this.state.type}`,
        uri: this.state.logo,
      });
      const response = await axios.post('/companies/dataCompanies', form);
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
          onPress={() => {
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
                          logo: fileInput.uri,
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
                          logo: fileInput.uri,
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
              onPress={this.saveLogo}
              disabled={!this.state.canSave}
            />
          </Avatar>
        </Pressable>
      </View>
    );
  }
}

const viewStyle: ViewStyle[] = [
  {alignSelf: 'center', top: -30},
  {alignSelf: 'flex-start'},
];

export default Logo;
