import React, {useState} from 'react';
import {
  ListRenderItemInfo,
  Modal,
  Pressable,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Card, Text, Button} from 'react-native-elements';
import {DropdownOption} from '../custom_types/state_types';

type Props = {
  data: DropdownOption[];
  style?: ViewStyle;
  description?: string;
  onInput: (value: string) => void;
};

const ModalDropdown = (props: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVal, setCurrentVal] = useState(props.data[0].label);

  const onItemPressed = (label: string, value: string) => {
    setCurrentVal(label);
    setModalVisible(!modalVisible);
    props.onInput(value);
  };

  const _listItem = (item: ListRenderItemInfo<typeof props.data[0]>) => (
    <View>
      <Pressable
        onPress={() => onItemPressed(item.item.label, item.item.value)}
        style={pressableStyle}
        android_ripple={{
          color: 'gray',
        }}>
        <Text style={textStyle[0]}>{item.item.label}</Text>
      </Pressable>
      <Card.Divider />
    </View>
  );

  return (
    <View>
      <Modal
        visible={modalVisible}
        animationType={'slide'}
        onRequestClose={() => setModalVisible(!modalVisible)}>
        <Text style={textStyle[1]}>Select an option</Text>
        <Text style={textStyle[2]}>{props.description}</Text>
        <FlatList
          data={props.data}
          renderItem={_listItem}
          keyExtractor={(item, index) => `${index}`}
        />
      </Modal>
      <Button
        title={currentVal}
        onPress={() => setModalVisible(!modalVisible)}
        buttonStyle={props.style}
      />
    </View>
  );
};

const pressableStyle: ViewStyle = {
  padding: 12,
};

const textStyle: TextStyle[] = [
  {
    fontSize: 15,
    fontWeight: 'bold',
  },
  {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
  },
  {
    alignSelf: 'center',
    fontSize: 15,
    margin: 5,
  },
];

export default ModalDropdown;
