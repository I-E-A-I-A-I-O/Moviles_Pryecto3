import React, {useState} from 'react';
import {ScrollView,Pressable, View,TextStyle, ViewStyle, Alert} from 'react-native'
import {Text, Input, Button, Card} from 'react-native-elements';
import type {RootReducerType as CombinedState} from '../../store/rootReducer';
import {connect, ConnectedProps} from 'react-redux';
import toast from 'react-native-toast-message';
import axios from 'axios';

const mapStateToProps = (state: CombinedState) => ({
    state: state.session,
  });
  
const connector = connect(mapStateToProps, {});
  
type Props = ConnectedProps<typeof connector>;

type State ={
    loading: boolean;
    name:string;
    email:string;
    direccion:string;
    telfFijo:string;
    telfCelular:string;
    tipo:string;
}

class companies extends React.Component<Props,State>{

    constructor(props: Props){
        super(props);
        this.state ={
            loading: false,
            name:'',
            email:'',
            direccion:'',
            telfFijo: '',
            telfCelular:'',
            tipo:''
        }
    }

    private submitData = async ()=>{
        let form = new FormData();
        form.append('name', this.state.name)
        form.append('email', this.state.email.toLowerCase());
        form.append('direccion',this.state.direccion);
        form.append('telfFijo', this.state.telfFijo);
        form.append('telfCelular', this.state.telfCelular);
        form.append('tipo', this.state.tipo);
        try {
          const response = await axios.post('/users/user/auth/verify', form);
        } catch (err) {
          console.error(err);
          toast.show({
            type: 'error',
            text1: err.response.data.content,
            autoHide: true,
            position: 'bottom',
          });
        }
    }

    render(){
        return(
            <ScrollView>         
                <Card>
                    <Text style={textStyles[1]}>Create Companies</Text>
                    <Card.Divider />
                    <Input
                    placeholder={'Name Companies...........'}
                    label={'Name Companies'}       
                    onChangeText={text => this.setState({...this.state, name: text})}
                    />
                    <Input
                    placeholder={'Email........'}
                    label={'Email'}
                    keyboardType={'email-address'}
                    textContentType={'emailAddress'}
                    autoCompleteType={'email'}   
                    onChangeText={text => this.setState({...this.state, email: text})} 
                    />
                    <Input
                    placeholder={'Direccion.........'}
                    label={'Direccion'}
                    onChangeText={text => this.setState({...this.state, direccion: text})}
                    />
                    <Input
                    label={'Telefono Fijo'}
                    placeholder={'Telefono fijo............'}
                    onChangeText={text => this.setState({...this.state, telfFijo: text})}
                    />
                    <Input
                    label={'Telefono Celular'}
                    placeholder={'Telefono Celular............'} 
                    onChangeText={text => this.setState({...this.state, telfCelular: text})}
                    />
                    <Input
                    label={'Tipo de empresa'}
                    placeholder={'Tipo de empresa............'}
                    onChangeText={text => this.setState({...this.state, tipo: text})}
                    />
                    <Button title={'CREATE'} onPress={this.submitData} />
                </Card>  
            </ScrollView>  
        )   
    }
}

const textStyles: TextStyle[] = [
    {
      color: '#3282b8',
      fontWeight: 'bold',
      fontSize: 15,
      textDecorationLine: 'underline',
      paddingLeft: 10,
      paddingTop: 15,
    },
  
    {
      color: 'black',
      alignSelf: 'center',
      fontSize: 30,
      paddingTop: 50,
      paddingBottom: 50,
      fontWeight: 'bold',
    },
    {
      color: '#3282b8',
      fontWeight: 'bold',
      fontSize: 15,
      textDecorationLine: 'underline',
      paddingLeft: 10,
      paddingTop: 15,
    },
  ];
  
  const viewStyle: ViewStyle = {
    display: 'flex',
    flexDirection: 'row',
  };
export default companies;