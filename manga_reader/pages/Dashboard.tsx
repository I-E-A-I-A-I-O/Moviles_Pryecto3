import React, {useState} from 'react';
import {View, ActivityIndicator, TextStyle} from 'react-native';
import {Input, Card, Icon, Text} from 'react-native-elements';
import { ScrollView} from 'react-native-gesture-handler';
import IonIcons from 'react-native-vector-icons/FontAwesome5';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootTabNavigatorParamList} from '../custom_types/navigation_types';

type dashboardScreenNavigationProp = StackNavigationProp<
RootTabNavigatorParamList,
  'Dashboard'
>;

type Props =  {
  navigation: dashboardScreenNavigationProp;
};

const Dashboard = (props: Props) => {

  return (
    <ScrollView>     
      <View >
        <IonIcons style={ textStyle[1]}
              name={'user'} color={'black'} size={40} 
              onPress={()=> props.navigation.navigate('Profile')}/>  
     
        <View style={textStyle[0]}>
          <Input placeholder={"Search....."}  /> 
        </View>
        
        <Card.Divider style={{ top: "-50%", backgroundColor: 'black' }}/>
      </View>
    </ScrollView>
  );
};

const textStyle : TextStyle[] = [
  {
    color: 'black',
    alignSelf: 'center',
    fontSize: 20,
    width: 290,
    top: -110
  },
  {
    color: 'black',
    alignSelf: 'flex-start',
    paddingTop: 30,
    paddingBottom: 50, 
    left: '2%',
    top: '-1.5%'
  }

]

export default Dashboard;
