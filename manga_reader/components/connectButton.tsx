import React from 'react';
import {View, ViewStyle} from 'react-native';
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
  buttonStyle: ViewStyle;
};

class ConnectButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      status: 'Connect',
      loading: false,
      buttonStyle: buttonVisualStyles[0],
    };
  }

  private disconnect = async () => {
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
          buttonStyle: buttonVisualStyles[0],
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
  };

  private request = async () => {
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
        buttonStyle: buttonVisualStyles[3],
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({
        ...this.state,
        loading: false,
      });
    }
  };

  private cancel = async () => {
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
          buttonStyle: buttonVisualStyles[0],
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
  };

  private accept = async () => {
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
          {headers: {authorization: this.props.token}},
        );
        this.setState({
          ...this.state,
          status: 'Disconnect',
          id: response.data.id,
          buttonStyle: buttonVisualStyles[1],
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
  };

  private onButtonPress = () => {
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
  };

  private getConnectionStatus = async () => {
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
        let style: ViewStyle;
        switch (response.data.status) {
          case 'Accept': {
            style = buttonVisualStyles[2];
            break;
          }
          case 'Disconnect': {
            style = buttonVisualStyles[1];
            break;
          }
          case 'Pending': {
            style = buttonVisualStyles[3];
            break;
          }
          case 'Connect': {
            style = buttonVisualStyles[0];
            break;
          }
          default: {
            style = buttonVisualStyles[0];
            break;
          }
        }
        this.setState({
          ...this.state,
          status: response.data.status,
          id: response.data.id,
          buttonStyle: style,
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
  };

  componentDidMount() {
    this.getConnectionStatus();
  }

  render() {
    return (
      <View style={rootViewStyle}>
        {this.state.status !== 'Same user' && (
          <>
            <Button
              style={buttonPositionStyles}
              buttonStyle={this.state.buttonStyle}
              onPress={this.onButtonPress}
              disabled={this.state.loading}
              title={this.state.status}
            />
            {this.state.status === 'Accept' && (
              <Button
                buttonStyle={buttonVisualStyles[1]}
                title={'Decline'}
                onPress={this.cancel}
                disabled={this.state.loading}
              />
            )}
          </>
        )}
      </View>
    );
  }
}

const rootViewStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 15,
  marginBottom: 15,
};

const buttonPositionStyles: ViewStyle = {
  width: '25%',
};

const buttonVisualStyles: ViewStyle[] = [
  {
    borderRadius: 25,
  },
  {
    borderRadius: 25,
    backgroundColor: 'red',
    marginLeft: 25,
  },
  {
    borderRadius: 25,
    backgroundColor: 'lime',
  },
  {
    borderRadius: 25,
    backgroundColor: 'gray',
  },
];

export default ConnectButton;
