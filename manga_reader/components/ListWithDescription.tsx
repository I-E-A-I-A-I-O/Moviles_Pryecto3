import React from 'react';
import {
  ListRenderItemInfo,
  Pressable,
  View,
  VirtualizedList,
} from 'react-native';
import {Button, Card, Text} from 'react-native-elements';

type Props = {
  onCreate: () => void;
  title: string;
  data: {
    id: string;
    name: string;
  }[];
  token: string;
  deviceUser: boolean;
};

const ListWDescription = (props: Props) => {
  const _pressableItem = (item: ListRenderItemInfo<any>) => (
    <Pressable>
      <Text>{item.item.name}</Text>
    </Pressable>
  );

  return (
    <Card>
      <Card.Title>{props.title}</Card.Title>
      <Card.Divider />
      <VirtualizedList
        scrollEnabled={false}
        listKey={props.title}
        getItemCount={() => props.data.length}
        getItem={(data, index) => data[index]}
        data={props.data}
        keyExtractor={item => item.id}
        renderItem={_pressableItem}
        ListFooterComponent={
          <View>
            {props.deviceUser && (
              <Button title={'Add'} onPress={props.onCreate} />
            )}
          </View>
        }
      />
    </Card>
  );
};

export default ListWDescription;
