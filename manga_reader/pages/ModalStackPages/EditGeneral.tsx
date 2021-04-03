import React, {useState} from 'react';
import {TextStyle} from 'react-native';
import {Text, Input} from 'react-native-elements';
import {SubmitButton, dateFunctions} from '../../components';
import {RouteProp} from '@react-navigation/native';
import {ModalStackParamList} from '../../custom_types/navigation_types';
import {ScrollView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import axios from 'axios';

type EditGeneralRouteProp = RouteProp<ModalStackParamList, 'EditGeneral'>;
type Props = {
  route: EditGeneralRouteProp;
};

const EditGeneralModal = (props: Props) => {
  const [lname, setLname] = useState(
    props.route.params.currentDescription?.last_name,
  );
  const [age, setAge] = useState(props.route.params.currentDescription?.age);
  const [address, setAddress] = useState(
    props.route.params.currentDescription?.address,
  );
  const [country, setCountry] = useState(
    props.route.params.currentDescription?.country,
  );
  const [description, setDescription] = useState(
    props.route.params.currentDescription?.description,
  );
  const [gender, setGender] = useState(
    props.route.params.currentDescription?.gender,
  );
  const [date, setDate] = useState(
    props.route.params.currentDescription?.birth_date?.split('T')[0],
  );

  const submit = async () => {
    const reqBody = {
      age: age,
      address: address,
      description: description,
      country: country,
      gender: gender,
      b_date: date,
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

  const validate = async () => {
    try {
      if (age && !(age >= 18 && age < 90)) {
        throw 'Invalid age';
      }
      if (!dateFunctions.isDateValid(date ?? '')) {
        throw 'Invalid date!';
      }
      if (age) {
        const year = dateFunctions.getNumbers(date ?? '')?.year;
        if (year !== new Date(Date.now()).getFullYear() - (age + 1)) {
          throw 'Invalid date!';
        }
      }
      await submit();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: err,
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
        maxLength={25}
        textContentType={'familyName'}
        onChangeText={text => setLname(text)}
      />
      <Input
        label={'Gender'}
        value={gender}
        maxLength={15}
        onChangeText={text => setGender(text)}
      />
      <Input
        label={'Country'}
        value={country}
        maxLength={25}
        textContentType={'countryName'}
        onChangeText={text => setCountry(text)}
      />
      <Input
        label={'Description'}
        value={description}
        multiline
        maxLength={140}
        onChangeText={text => setDescription(text)}
      />
      <Input
        label={'Address'}
        value={address}
        autoCompleteType={'street-address'}
        maxLength={140}
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
        value={date}
        keyboardType={'phone-pad'}
        onChangeText={setDate}
      />
      <SubmitButton title={'Update'} onPress={validate} />
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
