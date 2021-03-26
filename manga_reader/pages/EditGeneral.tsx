import React, {useState} from 'react';
import {Platform, Pressable, TextStyle, View} from 'react-native';
import {Text, Input} from 'react-native-elements';
import SubmitButton from '../components/submitButton';
import {RouteProp} from '@react-navigation/native';
import {ModalStackParamList} from '../custom_types/navigation_types';
import {ScrollView} from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [bdate, setBdate] = useState(
    props.route.params.currentDescription.birth_date,
  );
  const [date, setDate] = useState(new Date(1598051730000));
  const [show, setShow] = useState(false);

  const onChange = (event: Event, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setBdate(new Date(date).toISOString());
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
        value={age}
        keyboardType={'numeric'}
        onChangeText={text => setAge(text)}
      />
      <Pressable onPress={() => setShow(!show)}>
        <Input label={'Birth date'} value={bdate} disabled />
      </Pressable>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </ScrollView>
  );
};

const textStyle: TextStyle = {
  fontSize: 20,
  alignSelf: 'center',
  paddingTop: 50,
  paddingBottom: 50,
};

export default EditGeneralModal;
