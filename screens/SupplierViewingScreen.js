import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SupplierViewingScreen = props => {
    return <View style = {Styles.container}>
        <Text>This is Supplier Screen Coming Soon!!</Text>
        <Button title = 'SignOut' onPress= {() => {
            Alert.alert(
                'SignOut',
                'Do you want to SignOut?',
                [
                    { text: 'Cancel', onPress: () => {
                        // console.log('Cancel Pressed')
                    } },
                    { text: 'OK', onPress: async () => {
                        // console.log('OK Pressed')
                        try{
                            await AsyncStorage.multiRemove(['UserName','Password']);
                            // console.log('Done');
                            props.navigation.navigate({
                                routeName : 'Auth'
                            })
                        }catch(err){
                
                        }
                    } }
                ],
                { cancelable: false }
            );
        }}/>
    </View>
}

const Styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : 'center',
        justifyContent : 'center'
    }
})
export default SupplierViewingScreen;