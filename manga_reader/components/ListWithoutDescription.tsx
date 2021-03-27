import axios from 'axios';
import React, {useState} from 'react';
import {
  ListRenderItemInfo,
  Pressable,
  TextStyle,
  View,
  VirtualizedList,
} from 'react-native';
import {Card, Icon, Text, Input, Button} from 'react-native-elements';
import {FlatList} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

type Props = {
  abilities: {ability_id: string; name: string}[];
  deviceUser: boolean;
  token: string;
};

const ListWODescription = (props: Props) => {
  const [inputs, setInputs] = useState<string[] | undefined>();
  const [saving, setSaving] = useState(false);
  const [abilities, setAbilities] = useState(props.abilities);

  const saveAbility = async (ability: string, ItemIndex: number) => {
    if (ability.length > 1 && ability.length < 36) {
      setSaving(true);
      try {
        const response = await axios.post(
          '/users/user/abilities/ability',
          {ability: ability},
          {
            headers: {authorization: props.token},
          },
        );
        setInputs(inputs?.filter((value, index) => index !== ItemIndex));
        setAbilities([...(abilities ?? []), response.data.content]);
      } catch (err) {
        console.error(err);
        Toast.show({
          text1: err.response.data.content,
          type: 'error',
          position: 'bottom',
          autoHide: true,
        });
      } finally {
        setSaving(false);
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Must be between 2 and 35 characters',
        autoHide: true,
        position: 'bottom',
      });
    }
  };

  const deleteAbility = async (id: string) => {
    setSaving(true);
    try {
      await axios.delete(`/users/user/abilities/ability/${id}`, {
        headers: {authorization: props.token},
      });
      setAbilities(abilities?.filter(value => value.ability_id !== id));
    } catch (err) {
      console.error(err);
      Toast.show({
        text1: err.response.data.content,
        type: 'error',
        position: 'bottom',
        autoHide: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const _customInput = (item: ListRenderItemInfo<any>) => (
    <Input
      leftIcon={
        <Pressable
          disabled={saving}
          onPress={() =>
            setInputs(inputs?.filter((value, index) => index !== item.index))
          }
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
      }
      placeholder={`New ability ${item.index + 1}`}
      onChangeText={text => {
        item.item = text;
      }}
      rightIcon={
        <Pressable
          disabled={saving}
          onPress={() => saveAbility(item.item, item.index)}
          android_ripple={{
            borderless: true,
            color: 'gray',
          }}>
          <Icon
            type={'font-awesome-5'}
            name={'save'}
            color={saving ? 'gray' : 'lime'}
          />
        </Pressable>
      }
    />
  );

  const _userAbility = (item: ListRenderItemInfo<any>) => (
    <Text style={textStyle}>
      {props.deviceUser && (
        <Pressable
          disabled={saving}
          onPress={() => deleteAbility(item.item.ability_id)}
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
      <Card.Title>Abilities</Card.Title>
      <Card.Divider />
      <VirtualizedList
        listKey={'abilities'}
        scrollEnabled={false}
        data={abilities}
        getItem={(data, index) => abilities[index]}
        getItemCount={() => abilities?.length}
        renderItem={_userAbility}
        keyExtractor={item => item.ability_id}
        ListFooterComponent={
          <View>
            {props.deviceUser && (
              <View>
                <FlatList
                  scrollEnabled={false}
                  data={inputs}
                  renderItem={_customInput}
                  keyExtractor={(item, index) =>
                    `${Math.random() * 100}-${index}`
                  }
                />
                <Button
                  title={'Add'}
                  onPress={() => setInputs([...(inputs ?? []), ''])}
                />
              </View>
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

export default ListWODescription;
