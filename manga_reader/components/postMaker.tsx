import React, {useState} from 'react';
import {View, Image, ImageStyle, ViewStyle} from 'react-native';
import {Input, Icon, Card} from 'react-native-elements';
import {SubmitButton} from '../components';
import {connect, ConnectedProps} from 'react-redux';
import axios from 'axios';

import type {RootReducerType as CombinedState} from '../store/rootReducer';

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  style?: ViewStyle;
};

const PostMaker = (props: Props) => {
  const [uri, setUri] = useState<string | undefined>();
  return (
    <View style={props.style}>
      <Image
        style={imageStyle}
        source={{
          uri: 'https://miro.medium.com/max/2004/1*nLPOzPkUMPraMD6Q6QfBxw.jpeg',
        }}
      />
      <Input multiline maxLength={150} placeholder={'Post something'} />
      <Icon type={'font-awesome-5'} name={'image'} />
      <Card.Divider />
    </View>
  );
};

const imageStyle: ImageStyle = {
  alignSelf: 'center',
  width: '100%',
  height: '50%',
  borderRadius: 15,
  resizeMode: 'contain',
  paddingBottom: 0,
};
export default connector(PostMaker);
