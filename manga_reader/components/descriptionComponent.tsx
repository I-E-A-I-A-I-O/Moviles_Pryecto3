import React from 'react';
import {Pressable, Text, TextStyle} from 'react-native';
import {Card, Icon} from 'react-native-elements';

type Props = {
  description: {
    description: string | undefined;
    country: string | undefined;
    address: string | undefined;
    gender: string | undefined;
    age: number | undefined;
    last_name: string | undefined;
    birth_date: string | undefined;
  };
  deviceUser: boolean;
  navigate: () => void;
};

const DescriptionComponent = (props: Props) => {
  return (
    <Card>
      <Card.Title>
        General{'   '}
        {props.deviceUser && (
          <Pressable
            android_ripple={{
              borderless: true,
              color: 'gray',
            }}
            onPress={props.navigate}>
            <Icon type={'font-awesome-5'} name={'pen'} size={15} />
          </Pressable>
        )}
      </Card.Title>
      <Card.Divider />
      <Text>Last name: {props.description.last_name}</Text>
      <Text>Gender: {props.description.gender ?? 'undefined'}</Text>
      <Text>Age: {props.description.age}</Text>
      <Text>Birth date: {props.description.birth_date?.split('T')[0]}</Text>
      <Text>Country: {props.description.country}</Text>
      <Text>Address: {props.description.address}</Text>
      <Text style={TextStyles[1]}>Description</Text>
      <Card.Divider />
      <Text style={TextStyles[1]}>{props.description.description}</Text>
    </Card>
  );
};

const TextStyles: TextStyle[] = [
  {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    paddingTop: 25,
  },
  {
    alignSelf: 'center',
  },
];

export default DescriptionComponent;
