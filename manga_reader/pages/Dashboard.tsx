import React from 'react';
import {View, TextStyle, Pressable} from 'react-native';
import {Input, Card, Icon} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {
  RootTabNavigatorParamList,
  ModalStackParamList,
} from '../custom_types/navigation_types';
import {CompositeNavigationProp} from '@react-navigation/native';

type DashboardScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabNavigatorParamList, 'Dashboard'>,
  StackNavigationProp<ModalStackParamList>
>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

const Dashboard = (props: Props) => {
  return (
    <ScrollView>
      <View>
        <Pressable
          android_ripple={{
            borderless: false,
            color: 'gray',
          }}
          onPress={() =>
            props.navigation.navigate('ProfileModal', {
              deviceUser: true,
              name: '',
              user_id: '',
            })
          }>
          <Icon
            style={textStyle[1]}
            name={'user'}
            color={'black'}
            type={'font-awesome-5'}
            size={40}
          />
        </Pressable>

        <View style={textStyle[0]}>
          <Input placeholder={'Search.....'} />
        </View>

        <Card.Divider style={{top: '-50%', backgroundColor: 'black'}} />
      </View>
    </ScrollView>
  );
};

const textStyle: TextStyle[] = [
  {
    color: 'black',
    alignSelf: 'center',
    fontSize: 20,
    width: 290,
    top: -110,
  },
  {
    color: 'black',
    alignSelf: 'flex-start',
    paddingTop: 30,
    paddingBottom: 50,
    left: '2%',
    top: '-1.5%',
  },
];

export default Dashboard;
