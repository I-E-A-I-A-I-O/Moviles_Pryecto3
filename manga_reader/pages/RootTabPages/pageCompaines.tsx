import React from 'react';
import {ScrollView,TextStyle, ViewStyle} from 'react-native'
import {Text, Input, Button, Card} from 'react-native-elements';
import type {RootReducerType as CombinedState} from '../../store/rootReducer';
import {connect, ConnectedProps} from 'react-redux';
import {SubmitButton} from '../../components'
import toast from 'react-native-toast-message';
import axios from 'axios';

const mapStateToProps = (state: CombinedState) => ({
    state: state.session,
  });
  
const connector = connect(mapStateToProps, {});
  
type Props = ConnectedProps<typeof connector>;

type State ={
    name:string;
    email:string;
    telfCelular:string;
}

class companies extends React.Component<Props,State>{

    constructor(props: Props){
        super(props);
        this.state ={
            name:'',
            email:'',
            telfCelular:'',
        }
    }

    private submitData = async ()=>{
        let form = new FormData();
        form.append('name', this.state.name)
        form.append('email', this.state.email.toLowerCase());
        form.append('telfCelular', this.state.telfCelular);
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
                    label={'Telefono Celular'}
                    placeholder={'Telefono Celular............'} 
                    onChangeText={text => this.setState({...this.state, telfCelular: text})}
                    />
                    <SubmitButton title={'CREATE'} onPress={this.submitData} />
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
  
export default connector(companies);