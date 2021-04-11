import React from 'react';
import {ViewStyle} from 'react-native';
import {Avatar} from 'react-native-elements';

type Props = {
  user_id: string;
  style?: ViewStyle;
  size?: 'small' | 'large' | 'medium' | 'xlarge';
};

class UserAvatar extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <Avatar
        source={{
          uri: `https://mobile-comic-reader.herokuapp.com/users/user/${this.props.user_id}/avatar`,
          headers: {Range: 'bytes=0-'},
        }}
        rounded
        size={this.props.size ?? 'medium'}
        containerStyle={this.props.style}
      />
    );
  }
}

export default UserAvatar;
