import React from 'react';
import {ScrollView, View, ViewStyle} from 'react-native';
import {Text} from 'react-native-elements';
import {PostMaker, UserAvatar} from '../../components';
import type {RootReducerType as CombinedState} from '../../store/rootReducer';
import {connect, ConnectedProps} from 'react-redux';

const mapStateToProps = (state: CombinedState) => ({
  state: state.session,
});

const connector = connect(mapStateToProps, {});

type Props = ConnectedProps<typeof connector>;

const pageToPost = (props: Props) => {
  return (
    <ScrollView>
      <View>
        <UserAvatar 
          user_id={props.state.id}
          size={'large'}
          style={{left: 17, top: 30}}
        />
        <Text style={{fontSize: 30, top: -28 ,left: 110}} >{props.state.name}</Text>
      </View>
      <View style={style}>
        <PostMaker />
      </View>
    </ScrollView>
  );
};

const style: ViewStyle = {
  flex: 1,
};

export default pageToPost;
