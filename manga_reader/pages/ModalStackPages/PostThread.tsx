import React from 'react';
import {
  VirtualizedList,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import axios from 'axios';
import {RouteProp} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {Post} from '../../components';
import {StackNavigationProp} from '@react-navigation/stack';

import type {RootReducerType as CombinedState} from '../../store/rootReducer';
import type {ModalStackParamList} from '../../custom_types/navigation_types';

type PostThreadPageRouteProp = RouteProp<ModalStackParamList, 'PostThread'>;
type PostThreadPageNavProp = StackNavigationProp<
  ModalStackParamList,
  'PostThread'
>;

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  route: PostThreadPageRouteProp;
  navigation: PostThreadPageNavProp;
};
type Post = {
  id: string;
};
type State = {
  loading: boolean;
  posts: Post[];
};

class PostThread extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {loading: false, posts: []};
  }

  private fetchComments = async () => {
    this.setState({
      ...this.state,
      loading: true,
    });
    try {
      const response = await axios.get(
        `/posts/post/${this.props.route.params.post_id}/comments`,
      );
      this.setState({
        ...this.state,
        posts: response.data.content,
      });
    } catch (err) {
      Toast.show({
        text1: 'Could not load comments. Try again later.',
        type: 'error',
        position: 'bottom',
      });
    } finally {
      this.setState({
        ...this.state,
        loading: false,
      });
    }
  };

  private _listItem = (item: ListRenderItemInfo<Post>) => (
    <Pressable
      android_ripple={{color: 'gray'}}
      onPress={() =>
        this.props.navigation.push('PostThread', {
          post_id: item.item.id,
        })
      }>
      <Post id={item.item.id} label={'commented'} />
    </Pressable>
  );

  componentDidMount() {
    this.fetchComments();
  }

  render() {
    return (
      <VirtualizedList
        refreshControl={
          <RefreshControl
            refreshing={this.state.loading}
            onRefresh={this.fetchComments}
          />
        }
        getItem={(data, index) => this.state.posts[index]}
        getItemCount={() => this.state.posts.length}
        data={this.state.posts}
        keyExtractor={(item, index) => `${index}`}
        ListHeaderComponent={<Post id={this.props.route.params.post_id} />}
        renderItem={this._listItem}
      />
    );
  }
}

export default connector(PostThread);
