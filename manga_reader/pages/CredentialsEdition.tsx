import React from 'react';
import {Text, Input} from 'react-native-elements';
import {TextStyle} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {connect, ConnectedProps} from 'react-redux';

import type {RootReducerType as CombinedState} from '../store/rootReducer';

const mapStateToProps = (state: CombinedState) => ({
  token: state.session.token,
});
const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

const CredentialsEdition = (props: Props) => {
  return (
    <ScrollView>
      <Text>asd</Text>
    </ScrollView>
  );
};

export default connector(CredentialsEdition);
