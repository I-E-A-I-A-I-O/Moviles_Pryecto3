import React from 'react';
import {View, ViewStyle, TextStyle, Pressable} from 'react-native';
import {Text, Card} from 'react-native-elements';
import {UserAvatar} from '../components';

type Props = {
  id: string;
  name: string;
  description?: string;
  onPress?: () => void;
};

class UserBadge extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Pressable
          onPress={this.props.onPress}
          android_ripple={{
            color: 'gray',
          }}>
          <View style={viewStyle}>
            <UserAvatar user_id={this.props.id} size={'medium'} />
            <Text style={textStyle}>
              {'  '} {this.props.name} {this.props.description}
            </Text>
          </View>
        </Pressable>
        <Card.Divider />
      </View>
    );
  }
}

const viewStyle: ViewStyle = {
  flexDirection: 'row',
  padding: 10,
};

const textStyle: TextStyle = {
  fontSize: 16,
  fontWeight: 'bold',
  marginTop: 10,
};

export default UserBadge;
