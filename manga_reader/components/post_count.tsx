import React from 'react';
import {View, ViewStyle, TextStyle} from 'react-native';
import {Text, Card} from 'react-native-elements';
import axios from 'axios';

type Props = {
  post_id: string;
  doChange?: () => void;
  token: string;
};
type Count = {
  likes: number;
  dislikes: number;
  comments: number;
};
type State = {
  count: Count;
};

class InteractionCounter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {count: {comments: 0, dislikes: 0, likes: 0}};
    this.fetchCount.bind(this);
  }

  public async fetchCount() {
    try {
      const response = await axios.get(
        `/posts/post/${this.props.post_id}/interactions/count`,
        {
          headers: {authorization: this.props.token},
        },
      );
      this.setState({
        ...this.state,
        count: response.data,
      });
    } catch (err) {}
  }

  componentDidMount() {
    this.fetchCount();
  }

  render() {
    return (
      <View>
        <Card.Divider />
        <Text
          style={
            textStyle
          }>{`${this.state.count.likes} likes | ${this.state.count.dislikes} dislikes | ${this.state.count.comments} comments`}</Text>
        <Card.Divider />
      </View>
    );
  }
}

const textStyle: TextStyle = {
  color: 'gray',
  fontWeight: 'bold',
  fontSize: 14,
  fontStyle: 'italic',
  alignSelf: 'flex-end',
  marginRight: 10,
};

export default InteractionCounter;
