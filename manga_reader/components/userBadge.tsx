import axios from 'axios';
import React from 'react';
import {View, ViewStyle, TextStyle, Pressable} from 'react-native';
import {Text, Card} from 'react-native-elements';
import {UserAvatar, NotificationsSkeleton} from '../components';

type Props = {
  id: string;
  description?: string;
  onPress?: () => void;
  onLongPress?: () => void;
};

type State = {
  loading: boolean;
  name: string;
  last_name?: string;
};

class UserBadge extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {loading: true, name: ''};
  }

  private fetchData = async () => {
    try {
      const response = await axios.get(`/users/user/${this.props.id}/name`);
      this.setState({
        ...this.state,
        name: response.data.name,
        last_name: response.data.last_name,
        loading: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <View>
        {this.state.loading ? (
          <NotificationsSkeleton />
        ) : (
          <Pressable
            onPress={this.props.onPress}
            onLongPress={this.props.onLongPress}
            android_ripple={{
              color: 'gray',
            }}>
            <View style={viewStyle}>
              <UserAvatar user_id={this.props.id} size={'medium'} />
              <Text style={textStyle}>
                {'  '} {this.state.name} {this.state.last_name} {'\n'}{' '}
                <Text style={descriptionStyle}>{this.props.description}</Text>
              </Text>
            </View>
          </Pressable>
        )}
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

const descriptionStyle: TextStyle = {
  fontSize: 12,
  color: 'gray',
};

export default UserBadge;
