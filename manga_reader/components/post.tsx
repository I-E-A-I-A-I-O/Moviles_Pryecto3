import React from 'react';
import {
  View,
  ImageStyle,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import {Image, Text, Card} from 'react-native-elements';
import {connect, ConnectedProps} from 'react-redux';
import axios from 'axios';
import Video from 'react-native-video';
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
  uri: string | undefined;
  mediaType: 'image' | 'video' | undefined;
  owner: string;
  modalVisible: boolean;
  edit: boolean;
};

class Post extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      text: '',
      uri: undefined,
      owner: '',
      mediaType: 'image',
      name: '',
      modalVisible: false,
      edit: false,
    };
  }

  componentDidMount() {
    axios
      .get(`/posts/post/${this.props.id}`)
      .then(response => {
        console.log(response.data.mediaType);
        this.setState({
          ...this.state,
          owner: response.data.owner,
          text: response.data.text,
          mediaType: response.data.mediaType,
          uri: response.data.uri,
          name: response.data.name,
          loading: false,
        });
      })
      .catch(() => {});
  }

  private onCommentPress = () => {
    if (!this.state.loading) {
      this.setState({
        ...this.state,
        edit: false,
        modalVisible: true,
      });
    }
  };
  private onCloseModal = () => {
    this.setState({
      ...this.state,
      modalVisible: false,
    });
  };
  private onEditPress = () => {
    if (!this.state.loading) {
      this.setState({
        ...this.state,
        edit: true,
        modalVisible: true,
      });
    }
  };

  render() {
    return (
      <>
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
            {this.state.mediaType === 'image' ? (
              <Image
                style={imageStyle}
                source={{
                  uri: this.state.uri,
                }}
              />
            ) : this.state.mediaType === 'video' ? (
              <Video
                source={{uri: this.state.uri}}
                controls
                style={videoStyle}
              />
            ) : null}
          </View>
          <InteractionBar
            onCommentPress={this.onCommentPress}
            post_id={this.props.id}
            onEditPress={this.onEditPress}
            ownerButtons={this.state.owner === this.props.session_id}
          />
          <Card.Divider />
        </View>
        <ModalPostMaker
          post_id={this.props.id}
          visible={this.state.modalVisible}
          onRequestClose={this.onCloseModal}
          mediaType={this.state.mediaType}
          name={this.state.name}
          owner={this.state.owner}
          edit={this.state.edit}
          text={this.state.text}
          uri={this.state.uri}
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
