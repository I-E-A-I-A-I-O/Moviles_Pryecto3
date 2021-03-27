import React, {useState} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import {Text, Input} from 'react-native-elements';
import {SubmitButton} from '../components';
import {RouteProp} from '@react-navigation/native';
import {ModalStackParamList} from '../custom_types/navigation_types';
import {ScrollView} from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';
import axios from 'axios';

type EditGeneralRouteProp = RouteProp<ModalStackParamList, 'EditGeneral'>;
type Props = {
  route: EditGeneralRouteProp;
};

const EditGeneralModal = (props: Props) => {
  const [lname, setLname] = useState(
    props.route.params.currentDescription.last_name,
  );
  const [age, setAge] = useState(props.route.params.currentDescription.age);
  const [address, setAddress] = useState(
    props.route.params.currentDescription.address,
  );
  const [country, setCountry] = useState(
    props.route.params.currentDescription.country,
  );
  const [description, setDescription] = useState(
    props.route.params.currentDescription.description,
  );
  const [gender, setGender] = useState(
    props.route.params.currentDescription.gender,
  );
  const [date, setDate] = useState(
    new Date(props.route.params.currentDescription.birth_date ?? 0),
  );

  const submit = async () => {
    const reqBody = {
      age: age,
      address: address,
      description: description,
      country: country,
      gender: gender,
      b_date: new Date(date).toUTCString(),
      last_name: lname,
    };
    try {
      const response = await axios.patch('/users/user/general', reqBody, {
        headers: {authorization: props.route.params.token},
      });
      Toast.show({
        type: 'success',
        text1: response.data.content,
        position: 'bottom',
        autoHide: true,
      });
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        autoHide: true,
        text1: err.response.data.content,
        position: 'bottom',
      });
    }
  };

  return (
    <ScrollView>
      <Text style={textStyle}>Update general profile information</Text>
      <Input
        label={'Last name'}
        value={lname}
        textContentType={'familyName'}
        onChangeText={text => setLname(text)}
      />
      <Input
        label={'Gender'}
        value={gender}
        onChangeText={text => setGender(text)}
      />
      <Input
        label={'Country'}
        value={country}
        textContentType={'countryName'}
        onChangeText={text => setCountry(text)}
      />
      <Input
        label={'Description'}
        value={description}
        multiline
        onChangeText={text => setDescription(text)}
      />
      <Input
        label={'Address'}
        value={address}
        autoCompleteType={'street-address'}
        textContentType={'fullStreetAddress'}
        multiline
        onChangeText={text => setAddress(text)}
      />
      <Input
        label={'Age'}
        value={age?.toString()}
        keyboardType={'numeric'}
        onChangeText={text => {
          if (!Number.isNaN(Number.parseInt(text, 10))) {
            setAge(Number.parseInt(text, 10));
          } else if (text.length === 0) {
            setAge(undefined);
          }
        }}
      />
      <Input
        label={'Birth date'}
        value={new Date(date).toLocaleDateString()}
        disabled
      />
      <DatePicker
        mode={'date'}
        onDateChange={setDate}
        date={date}
        minimumDate={new Date(1950, 1, 1)}
        maximumDate={new Date(2001, 1, 1)}
        style={viewStyle}
      />
      <SubmitButton title={'Update'} onPress={submit} />
    </ScrollView>
  );
};

const textStyle: TextStyle = {
  fontSize: 20,
  alignSelf: 'center',
  paddingTop: 50,
  paddingBottom: 50,
};

const viewStyle: ViewStyle = {
  alignSelf: 'center',
};

export default EditGeneralModal;
