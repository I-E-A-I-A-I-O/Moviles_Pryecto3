import React from 'react';
import {Modal, TextStyle, View, ViewStyle} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {PostMaker, UserAvatar} from '../components';
import {Text} from 'react-native-elements';

import type {RootReducerType as CombinedState} from '../store/rootReducer';

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
  session_id: state.session.id,
  state: state.session
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  post_id: string;
  visible: boolean;
  name?: string;
  owner?: string;
  text?: string;
  edit?: boolean;
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
            <Text style={textStyle}>{`Comment in ${
              this.props.name
            }'s ${'post'}`}</Text>
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
        <View>
        <UserAvatar 
          user_id={this.props.state.id}
          size={'large'}
          style={{left: 17, top: 30}}
        />
        <Text style={{fontSize: 30, top: -28 ,left: 110}} >{this.props.state.name}</Text>
      </View>
        <PostMaker
          edit={this.props.edit}
          comment={!this.props.edit}
          post_id={this.props.post_id}
          text={this.props.text}
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
