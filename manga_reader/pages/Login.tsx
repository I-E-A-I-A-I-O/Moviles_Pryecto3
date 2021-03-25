import React, { useState } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';
import toast from 'react-native-toast-message';
import { Text, Input, Button } from 'react-native-elements'
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../custom_types/navigation_types';
import { SaveSessionData } from '../store/session-store/actions'

type RegisterPart1ScreenNavigationProp = StackNavigationProp<RootStackParamList,'Register_1'>;

type Props = {
  navigation: RegisterPart1ScreenNavigationProp;
};

function loginPage (props: Props){

    const [loading, setLoading] = useState(false);
    const [buttonTitle, setButtonTitle] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

        return (
            <View style={{ flex: 1, top: '25%' }} >
                <Text style={{ color: '#dbd8e3', textAlign: 'center', fontSize: 38, bottom: '8%', position: 'relative' }} >Clon LinkedIn</Text>
                <Input
                    onChange={(e) => {
                        setEmail( e.nativeEvent.text );
                    }}
                    placeholder={'Your Email'} label={'Email'} selectionColor={'#e94560'}
                    style={{ color: 'black' }} 
                />
                <Input
                    onChange={(e) => {
                        setPassword( e.nativeEvent.text );
                    }}
                    secureTextEntry={true} label={'Password'} selectionColor={'#e94560'}
                    style={{ color: 'black' }} placeholder={'Your Password'}
                />
                <Button
                    title={buttonTitle}
                    disabled={loading}
                    icon={<ActivityIndicator color={'#e94560'} animating={loading} />}
                    onPress={() => {
                        setLoading(true);
                        setButtonTitle('');
                        let data = {
                            email: email,
                            password: password
                        };
                        loginRequest(data).then(json => {
                            setButtonTitle('Login');
                            setLoading(false);
                            if (json.title !== 'Success') {
                                toast.show({ type: 'error', position: 'bottom', autoHide: true, text1: json.content });
                            } else{
                                props.
                            }                          
                        }).catch(err => {
                            console.log(err);
                            toast.show({ type: 'error', position: 'bottom', autoHide: true, text1: 'Network error. Try again later' });
                        })
                    }}
                />
                <Text
                    style={ {
                        color: '#3282b8',
                        fontWeight: 'bold',
                        fontSize: 15,
                        left: '2%',
                        position: 'relative',
                        top: '3%'
                    }}
                    onPress={() => {props.navigation.navigate('Register_1')}}
                >
                    Create account
                </Text>
            </View>
        )
    }


async function loginRequest(data: any) {
    let formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    let response = await fetch('http://localhost:8000/users/userLogin', {
        method: 'POST',
        body: formData
    }).catch(err => {
        console.log(err);
    });
    return response ? await response.json() : null;
}

export default loginPage;