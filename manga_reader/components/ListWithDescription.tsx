import axios from 'axios';
import React, {useState} from 'react';
import {
  ListRenderItemInfo,
  Pressable,
  TextStyle,
  View,
  VirtualizedList,
} from 'react-native';
import {Button, Card, Icon, Text} from 'react-native-elements';
import Toast from 'react-native-toast-message';

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
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(props.data);

  const deleteObject = async (id: string) => {
    setSaving(true);
    try {
      await axios.delete(`/users/user/jobs/job/${id}`, {
        headers: {authorization: props.token},
      });
      setData(data.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: err.response.data.content,
      });
    } finally {
      setSaving(false);
    }
  };

  const _pressableItem = (item: ListRenderItemInfo<any>) => (
    <Text style={textStyle}>
      {props.deviceUser && (
        <Pressable
          disabled={saving}
          onPress={() => deleteObject(item.item.id)}
          android_ripple={{
            borderless: true,
            color: 'gray',
          }}>
          <Icon
            type={'font-awesome-5'}
            name={'trash-alt'}
            color={saving ? 'gray' : 'red'}
          />
        </Pressable>
      )}
      {'  '}
      {item.item.name}
      {'\n'}
    </Text>
  );

  return (
    <Card>
      <Card.Title>{props.title}</Card.Title>
      <Card.Divider />
      <VirtualizedList
        scrollEnabled={false}
        listKey={props.title}
        getItemCount={() => data.length}
        getItem={(items, index) => items[index]}
        data={data}
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

const textStyle: TextStyle = {
  fontWeight: 'bold',
  fontSize: 15,
};

export default ListWDescription;
