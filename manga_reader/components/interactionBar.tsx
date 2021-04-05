import React from 'react';
import {View, ViewStyle, TextStyle, Pressable} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect, ConnectedProps} from 'react-redux';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {InteractionCounter} from '../components';

import type {RootReducerType as CombinedState} from '../store/rootReducer';

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  post_id: string;
  onCommentPress: () => void;
  onEditPress: () => void;
  ownerButtons?: boolean;
  onDeleted: () => void;
};
type InteractionState = {
  like: 'REMOVE' | 'ADD';
  dislike: 'REMOVE' | 'ADD';
  like_id?: string;
  dislike_id?: string;
};
type State = {
  loading: boolean;
  interaction: InteractionState;
};

class InteractionBar extends React.Component<Props, State> {
  private counterRef = React.createRef<InteractionCounter>();
  constructor(props: Props) {
    super(props);
    this.state = {loading: false, interaction: {dislike: 'ADD', like: 'ADD'}};
  }

  private deletePost = async () => {
    if (this.state.loading) {
      return;
    }
    try {
      this.setState({
        ...this.state,
        loading: true,
      });
      await axios.delete(`/posts/post/${this.props.post_id}`, {
        headers: {authorization: this.props.token},
      });
      Toast.show({
        text1: 'Post deleted',
        type: 'info',
        position: 'bottom',
      });
      this.props.onDeleted();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Could not delete the post. Try again later',
        position: 'bottom',
      });
      this.setState({
        ...this.state,
        loading: false,
      });
    }
  };

  private getState = async () => {
    this.setState({
      ...this.state,
      loading: true,
    });
    try {
      const response = await axios.get(
        `/posts/post/${this.props.post_id}/interaction/state`,
        {
          headers: {authorization: this.props.token},
        },
      );
      this.setState({
        ...this.state,
        interaction: response.data,
      });
    } catch (err) {
    } finally {
      this.setState({
        ...this.state,
        loading: false,
      });
    }
  };

  private interact = async (action: 'like' | 'dislike') => {
    this.setState({
      ...this.state,
      loading: true,
    });
    try {
      const response = await axios.put(
        `/posts/post/${this.props.post_id}/${action}`,
        this.state.interaction,
        {
          headers: {authorization: this.props.token},
        },
      );
      this.setState({
        ...this.state,
        interaction: response.data,
      });
      this.counterRef.current?.fetchCount();
    } catch (err) {
    } finally {
      this.setState({
        ...this.state,
        loading: false,
      });
    }
  };

  componentDidMount() {
    this.getState();
  }

  render() {
    return (
      <>
        <InteractionCounter
          token={this.props.token}
          post_id={this.props.post_id}
          ref={this.counterRef}
        />
        <View style={viewStyle}>
          {this.props.ownerButtons ? (
            <>
              <Pressable
                android_ripple={{color: 'gray', borderless: true}}
                onPress={this.deletePost}>
                <Icon
                  style={iconStyle}
                  color={this.state.loading ? 'gray' : 'red'}
                  name={'trash'}
                  type={'font-awesome-5'}
                />
              </Pressable>
              <Pressable
                android_ripple={{color: 'gray', borderless: true}}
                onPress={this.props.onEditPress}>
                <Icon style={iconStyle} name={'pen'} type={'font-awesome-5'} />
              </Pressable>
            </>
          ) : null}
          <Pressable
            android_ripple={{color: 'gray', borderless: true}}
            onPress={this.props.onCommentPress}>
            <Icon style={iconStyle} name={'comment'} type={'font-awesome-5'} />
          </Pressable>
          <Pressable
            android_ripple={{color: 'gray', borderless: true}}
            onPress={() => this.interact('dislike')}>
            <Icon
              style={iconStyle}
              name={'thumbs-down'}
              type={'font-awesome-5'}
              color={
                this.state.loading
                  ? 'gray'
                  : this.state.interaction.dislike === 'ADD'
                  ? 'black'
                  : 'red'
              }
              solid={this.state.interaction.dislike === 'REMOVE'}
            />
          </Pressable>
          <Pressable
            android_ripple={{color: 'gray', borderless: true}}
            onPress={() => this.interact('like')}>
            <Icon
              style={iconStyle}
              name={'thumbs-up'}
              type={'font-awesome-5'}
              color={
                this.state.loading
                  ? 'gray'
                  : this.state.interaction.like === 'ADD'
                  ? 'black'
                  : 'lime'
              }
              solid={this.state.interaction.like === 'REMOVE'}
            />
          </Pressable>
        </View>
      </>
    );
  }
}

const viewStyle: ViewStyle = {
  display: 'flex',
  flex: 1,
  flexDirection: 'row-reverse',
  margin: 10,
};

const iconStyle: TextStyle = {
  paddingLeft: 5,
  paddingRight: 10,
};

export default connector(InteractionBar);
