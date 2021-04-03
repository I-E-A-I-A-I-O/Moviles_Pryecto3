import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {Pressable, Text, TextStyle, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import type {ModalStackParamList} from '../../custom_types/navigation_types';
import type {DescriptionResponse} from '../../custom_types/state_types';
import {DescriptionSkeleton} from '../../components';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {Icon} from 'react-native-elements';

type DescriptionPageRouteProp = RouteProp<
  ModalStackParamList,
  'UserAttributeDescription'
>;
type DescriptionPageNavProp = StackNavigationProp<
  ModalStackParamList,
  'UserAttributeDescription'
>;
type Props = {
  route: DescriptionPageRouteProp;
  navigation: DescriptionPageNavProp;
};

const Description = (props: Props) => {
  const [data, setData] = useState<DescriptionResponse | undefined>();
  const [loading, setLoading] = useState(false);

  const capitalize = (string: string): string =>
    string[0].toUpperCase() + string.slice(1, string.length);

  const _listItem = (item: [string, string]) => (
    <Text style={textStyle}>
      {capitalize(item[0])}: {item[1]}
    </Text>
  );

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const parameter =
          props.route.params.type === 'education'
            ? 'title'
            : props.route.params.type;
        const response = await axios.get(
          `/users/user/${parameter}s/${parameter}/${props.route.params.id}`,
        );
        setData(response.data.content as DescriptionResponse);
        setLoading(false);
      } catch (err) {
        console.error(err);
        Toast.show({
          text1: err.response.data.content,
          type: 'error',
          position: 'bottom',
        });
      }
    };
    getData();
  }, [props.route.params.id, props.route.params.type]);

  const goToEdit = () => {
    switch (props.route.params.type) {
      case 'job': {
        props.navigation.navigate('JobExperienceEdition', {
          new: false,
          currentData: data as any,
          token: props.route.params.token,
          id: props.route.params.id,
        });
        break;
      }
      case 'award': {
        props.navigation.navigate('AwardEdition', {
          new: false,
          currentData: data as any,
          token: props.route.params.token,
          id: props.route.params.id,
        });
        break;
      }
      case 'project': {
        props.navigation.navigate('ProjectEdition', {
          new: false,
          currentData: data as any,
          token: props.route.params.token,
          id: props.route.params.id,
        });
        break;
      }
      case 'education': {
        props.navigation.navigate('EducationEdition', {
          new: false,
          currentData: data as any,
          token: props.route.params.token,
          id: props.route.params.id,
        });
        break;
      }
    }
  };

  return (
    <FlatList
      data={null}
      renderItem={null}
      ListHeaderComponent={
        <View>
          {loading ? (
            <DescriptionSkeleton />
          ) : (
            <View style={viewStyle}>
              {data && (
                <FlatList
                  data={Object.entries(data)}
                  keyExtractor={(item, index) => `${index}`}
                  renderItem={item => _listItem(item.item)}
                />
              )}
              {props.route.params.deviceUser && (
                <Pressable
                  android_ripple={{
                    borderless: true,
                    color: 'gray',
                  }}
                  onPress={goToEdit}>
                  <Icon type={'font-awesome-5'} name={'pen'} size={15} />
                </Pressable>
              )}
            </View>
          )}
        </View>
      }
    />
  );
};

const viewStyle: ViewStyle = {
  alignSelf: 'center',
  marginTop: 25,
};

const textStyle: TextStyle = {
  fontWeight: 'bold',
  fontSize: 17,
  marginBottom: 10,
};

export default Description;
