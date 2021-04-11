import React from 'react';
import {
  View,
  ImageStyle,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  NativeSyntheticEvent,
  ImageErrorEventData,
} from 'react-native';
import {Image, Text, Card} from 'react-native-elements';
import {connect, ConnectedProps} from 'react-redux';
import axios from 'axios';
import Video, {LoadError} from 'react-native-video';
import {UserAvatar, InteractionBar, ModalPostMaker} from '../components';

import type {RootReducerType as CombinedState} from '../store/rootReducer';

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
  session_id: state.session.id,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  style?: ViewStyle;
  id: string;
  onPress?: () => void;
  label?: string;
};
type State = {
  loading: boolean;
  text: string;
  name: string;
  owner: string;
  modalVisible: boolean;
  edit: boolean;
  deleted: boolean;
  image: boolean;
  video: boolean;
};

class Post extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      text: '',
      owner: '',
      name: '',
      modalVisible: false,
      edit: false,
      deleted: false,
      image: true,
      video: false,
    };
    this.onCloseModal.bind(this);
    this.onCommentPress.bind(this);
    this.onDeleted.bind(this);
    this.onEditPress.bind(this);
  }

  componentDidMount() {
    axios
      .get(`/posts/post/${this.props.id}`)
      .then(response => {
        this.setState({
          ...this.state,
          owner: response.data.owner,
          text: response.data.text,
          name: response.data.name,
          loading: false,
        });
      })
      .catch(() => {});
  }

  private async onCommentPress() {
    if (!this.state.loading) {
      this.setState({
        ...this.state,
        edit: false,
        modalVisible: true,
      });
    }
  }
  private async onCloseModal() {
    this.setState({
      ...this.state,
      modalVisible: false,
    });
  }
  private async onEditPress() {
    if (!this.state.loading) {
      this.setState({
        ...this.state,
        edit: true,
        modalVisible: true,
      });
    }
  }
  private async onDeleted() {
    this.setState({
      ...this.state,
      deleted: true,
    });
  }
  private async onImageErr(err: NativeSyntheticEvent<ImageErrorEventData>) {
    err.stopPropagation();
    this.setState({
      ...this.state,
      image: false,
      video: true,
    });
  }
  private async onVideoErr(err: LoadError) {
    console.error(err.error.errorString);
    this.setState({
      ...this.state,
      video: false,
    });
  }

  render() {
    return (
      <>
        {!this.state.deleted ? (
          <View>
            <View style={headerStyle}>
              {this.state.loading ? (
                <ActivityIndicator color={'lime'} />
              ) : (
                <UserAvatar user_id={this.state.owner} />
              )}
              <Text style={nameStyle}>{this.state.name}</Text>
              <Text style={labelStyle}>
                {this.props.label ? `~${this.props.label}` : ''}
              </Text>
            </View>
            <View style={bodyStyle}>
              <Text style={textStyle}>{this.state.text}</Text>
              {this.state.image ? (
                <Image
                  onError={this.onImageErr.bind(this)}
                  style={imageStyle}
                  source={{
                    uri: `http://192.168.0.101:8000/posts/post/${this.props.id}/media`,
                    headers: {Range: 'bytes=0-'},
                  }}
                />
              ) : null}
              {this.state.video ? (
                <Video
                  onError={this.onVideoErr.bind(this)}
                  source={{
                    uri: `http://192.168.0.101:8000/posts/post/${this.props.id}/media`,
                    headers: {Range: 'bytes=0-'},
                  }}
                  controls
                  style={videoStyle}
                />
              ) : null}
            </View>
            <InteractionBar
              onCommentPress={this.onCommentPress.bind(this)}
              post_id={this.props.id}
              onEditPress={this.onEditPress.bind(this)}
              ownerButtons={this.state.owner === this.props.session_id}
              onDeleted={this.onDeleted.bind(this)}
            />
            <Card.Divider />
          </View>
        ) : null}
        <ModalPostMaker
          post_id={this.props.id}
          visible={this.state.modalVisible}
          onRequestClose={this.onCloseModal.bind(this)}
          name={this.state.name}
          owner={this.state.owner}
          edit={this.state.edit}
          text={this.state.text}
        />
      </>
    );
  }
}

const headerStyle: ViewStyle = {
  flex: 1,
  flexDirection: 'row',
};
const nameStyle: TextStyle = {
  fontSize: 18,
  fontWeight: 'bold',
  marginLeft: 25,
  marginTop: 10,
};
const bodyStyle: ViewStyle = {
  justifyContent: 'center',
};
const textStyle: TextStyle = {
  fontSize: 20,
  alignSelf: 'center',
  marginBottom: 10,
};
const imageStyle: ImageStyle = {
  width: '100%',
  height: 300,
  borderRadius: 15,
  resizeMode: 'contain',
};
const videoStyle: ViewStyle = {
  width: '100%',
  height: 300,
  borderRadius: 15,
  backgroundColor: 'gray',
  marginTop: 25,
  marginBottom: 25,
};
const labelStyle: TextStyle = {
  color: 'gray',
  fontStyle: 'italic',
  marginTop: 15,
};

export default connector(Post);
