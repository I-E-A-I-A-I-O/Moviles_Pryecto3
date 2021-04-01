import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import axios from 'axios';
import Toast from 'react-native-toast-message';

type Props = {
  user_id: string;
  token: string;
  session_user_id: string;
};

type State = {
  status:
    | 'Same user'
    | 'Connect'
    | 'Disconnect'
    | 'Pending'
    | 'Accept'
    | 'Decline';
  loading: boolean;
  id?: string;
};

class ConnectButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {status: 'Connect', loading: false};
  }

  private async disconnect() {
    if (this.state.id) {
      try {
        this.setState({
          ...this.state,
          loading: true,
        });
        await axios.delete(`/connects/connection/${this.props.user_id}`, {
          headers: {authorization: this.props.token},
        });
        this.setState({
          ...this.state,
          status: 'Connect',
          id: undefined,
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.setState({
          ...this.state,
          loading: false,
        });
      }
    }
  }

  private async request() {
    try {
      this.setState({
        ...this.state,
        loading: true,
      });
      const response = await axios.post(
        '/connects/requests',
        {id: this.props.user_id},
        {
          headers: {authorization: this.props.token},
        },
      );
      this.setState({
        ...this.state,
        status: 'Pending',
        id: response.data.id,
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({
        ...this.state,
        loading: false,
      });
    }
  }

  private async cancel() {
    if (this.state.id) {
      try {
        this.setState({
          ...this.state,
          loading: true,
        });
        await axios.delete(`/connects/request/${this.state.id}`, {
          headers: {authorization: this.props.token},
        });
        this.setState({
          ...this.state,
          id: undefined,
          status: 'Connect',
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.setState({
          ...this.state,
          loading: false,
        });
      }
    }
  }

  private async accept() {
    if (this.state.id) {
      try {
        this.setState({
          ...this.state,
          loading: true,
        });
        const response = await axios.post(
          '/connects/connections',
          {
            request_id: this.state.id,
            user_id: this.props.user_id,
          },
          {headers: this.props.token},
        );
        this.setState({
          ...this.state,
          status: 'Disconnect',
          id: response.data.id,
        });
      } catch (err) {
        console.log(err);
      } finally {
        this.setState({
          ...this.state,
          loading: false,
        });
      }
    }
  }

  private async onButtonPress() {
    switch (this.state.status) {
      case 'Connect': {
        this.request();
        break;
      }
      case 'Disconnect': {
        this.disconnect();
        break;
      }
      case 'Pending': {
        this.cancel();
        break;
      }
      case 'Accept': {
        this.accept();
        break;
      }
    }
  }

  private async getConnectionStatus() {
    if (this.props.user_id === this.props.session_user_id) {
      this.setState({
        ...this.state,
        status: 'Same user',
      });
    } else {
      try {
        this.setState({
          ...this.state,
          loading: true,
        });
        const response = await axios.get(
          `/connects/status/${this.props.user_id}`,
          {headers: {authorization: this.props.token}},
        );
        this.setState({
          ...this.state,
          status: response.data.status,
          id: response.data.id,
        });
      } catch (err) {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: err.response.data,
          position: 'bottom',
        });
      } finally {
        this.setState({
          ...this.state,
          loading: false,
        });
      }
    }
  }

  componentDidMount() {
    this.getConnectionStatus();
  }

  render() {
    return (
      <View>
        {this.state.status !== 'Same user' && (
          <View>
            <Button
              onPress={this.onButtonPress}
              disabled={this.state.loading}
              title={this.state.status}
            />
            {this.state.status === 'Accept' && (
              <Button
                title={'Decline'}
                onPress={this.cancel}
                disabled={this.state.loading}
              />
            )}
          </View>
        )}
      </View>
    );
  }
}

export default ConnectButton;
