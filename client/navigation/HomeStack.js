import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import SettingScreen from '../screens/home/SettingScreen';

const Stack = createStackNavigator();


export default function HomeStack() {

    return (
        <Stack.Navigator initialRouteName="HomeScreen">
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/> 
            <Stack.Screen name="Settings" component={SettingScreen} options={{headerShown: false}}/>
        </Stack.Navigator>
    );
}
