import React from 'react';
import {View, ViewStyle, TextStyle, Pressable} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect, ConnectedProps} from 'react-redux';
import axios from 'axios';

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
};
type State = {
  loading: boolean;
};

class InteractionBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {loading: false};
  }

  render() {
    return (
      <View style={viewStyle}>
        {this.props.ownerButtons ? (
          <>
            <Pressable android_ripple={{color: 'gray', borderless: true}}>
              <Icon
                style={iconStyle}
                color={'red'}
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
        <Pressable android_ripple={{color: 'gray', borderless: true}}>
          <Icon
            style={iconStyle}
            name={'thumbs-down'}
            type={'font-awesome-5'}
          />
        </Pressable>
        <Pressable android_ripple={{color: 'gray', borderless: true}}>
          <Icon style={iconStyle} name={'thumbs-up'} type={'font-awesome-5'} />
        </Pressable>
      </View>
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
