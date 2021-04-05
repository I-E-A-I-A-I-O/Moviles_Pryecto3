import React from 'react';
import {Modal, TextStyle, View, ViewStyle} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {PostMaker, UserAvatar} from '../components';
import {Text} from 'react-native-elements';

import type {RootReducerType as CombinedState} from '../store/rootReducer';

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
  session_id: state.session.id,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  post_id: string;
  visible: boolean;
  name?: string;
  owner?: string;
  text?: string;
  mediaType?: 'video' | 'image';
  edit?: boolean;
  uri?: string;
  onRequestClose: () => void;
};
type State = {};

class ModalPostMaker extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}
        animationType={'slide'}>
        {!this.props.edit ? (
          <>
            <Text style={textStyle}>{`Comment in ${this.props.name}'s ${
              this.props.text?.length === 0
                ? this.props.mediaType ?? 'post'
                : 'post'
            }`}</Text>
            {this.props.owner ? (
              <View style={headerStyle}>
                <UserAvatar user_id={this.props.owner} />
              </View>
            ) : null}
            <View style={bodyStyle} collapsable>
              <Text style={contentStyle}>{this.props.text}</Text>
            </View>
          </>
        ) : null}
        <PostMaker
          edit={this.props.edit}
          comment={!this.props.edit}
          post_id={this.props.post_id}
          text={this.props.text}
          uri={this.props.uri}
          mediaType={
            this.props.mediaType
              ? this.props.mediaType === 'video'
                ? this.props.mediaType
                : 'photo'
              : undefined
          }
        />
      </Modal>
    );
  }
}

const textStyle: TextStyle = {
  alignSelf: 'center',
  fontWeight: 'bold',
  fontSize: 18,
  marginTop: 20,
  marginBottom: 20,
};
const headerStyle: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  alignContent: 'center',
  alignItems: 'center',
};
const bodyStyle: ViewStyle = {
  justifyContent: 'center',
  marginTop: 30,
};
const contentStyle: TextStyle = {
  fontSize: 20,
  alignSelf: 'center',
  marginTop: 30,
};

export default connector(ModalPostMaker);