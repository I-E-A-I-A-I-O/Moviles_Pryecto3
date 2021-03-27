import axios from 'axios';
import React from 'react';
import {ViewStyle} from 'react-native';
import {Avatar} from 'react-native-elements';

type Props = {
  user_id: string;
  style: ViewStyle | undefined;
  size: 'small' | 'large' | 'medium' | 'xlarge';
};

type State = {
  imgUri: string;
};

class UserAvatar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      imgUri:
        'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
    };
  }

  componentDidMount() {
    axios
      .get(`http://192.168.0.101:8000/users/user/${this.props.user_id}/avatar`)
      .then(response => {
        this.setState({
          ...this.state,
          imgUri: response.data,
        });
      });
  }

  render() {
    return (
      <Avatar
        source={{
          uri: this.state.imgUri,
        }}
        rounded
        size={this.props.size}
        containerStyle={this.props.style}
      />
    );
  }
}

export default UserAvatar;
