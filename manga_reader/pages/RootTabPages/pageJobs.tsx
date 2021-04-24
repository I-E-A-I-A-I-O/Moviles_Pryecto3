import React from 'react';
import {Text, View, TextStyle} from 'react-native';
import type {RootReducerType as CombinedState} from '../../store/rootReducer';
import {connect, ConnectedProps} from 'react-redux';

const mapStateToProps = (state: CombinedState) => ({
    state: state.session,
  });

const connector = connect(mapStateToProps, {});
  
type Props = ConnectedProps<typeof connector>;

const pageJob = (props: Props) =>{
    return(
        <View>
            <Text style={textStyles[0]}>Pages Of Jobs</Text>
        </View>
    )
}

const textStyles: TextStyle[] = [   
    {
      color: 'black',
      alignSelf: 'center',
      fontSize: 30,
      paddingTop: 45,
      paddingBottom: 50,
      fontWeight: 'bold',
    }
  ];

export default connector(pageJob);