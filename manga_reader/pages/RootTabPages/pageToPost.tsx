import React from 'react';
import {ScrollView, View, ViewStyle} from 'react-native';
import {Text} from 'react-native-elements';
import {PostMaker} from '../../components';

const pageToPost = () => {
  return (
    <View style={style}>
      <PostMaker />
    </View>
  );
};

const style: ViewStyle = {
  flex: 1,
};

export default pageToPost;
