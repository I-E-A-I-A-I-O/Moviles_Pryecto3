import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserPage from './userPage';

const Stack = createStackNavigator();

function ModalsStack() {
    return (
        <Stack.Navigator mode={'modal'} >
            <Stack.Screen
                name={'userPage'}
                component={UserPage}
                options={{ headerShown: false }}
            />        
        </Stack.Navigator>
    );
}

export default ModalsStack;