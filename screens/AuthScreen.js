import React, { useState, useEffect } from 'react';
import {View, StyleSheet, ImageBackground, Image, Text, TextInput, KeyboardAvoidingView, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import * as AuthActions from '../store/actions/authActions';
import AuthState from '../models/authstateModel';
import Colours from '../constants/Colors';


const AuthScreen = props => {
    
    const [userName, setUserName] = useState(null);
    const [password, setPassword] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [autologin,setAutoLogin] = useState(false);

    useEffect(() => {
        getAsyncValues();
    },[])

    let usrName,pass = null;
    const dispatch = useDispatch();

    const getAsyncValues = async () => { 
        try {
            setAutoLogin(true);
            usrName = await AsyncStorage.getItem('UserName');
            pass = await AsyncStorage.getItem('Password');
            //console.log(usrName+' '+pass);
            if(usrName !== null && pass !== null){
                try {
                    const response = await fetch('https://milkbook-337d2-default-rtdb.firebaseio.com/usersLoginData/'+usrName+'.json');
                    const resData = await response.json();
                    //console.log('Auto:' + resData.Name);
                    if(resData === null){
                        throw e;
                    }
                    if(pass === resData.Password) {
                        const authData = new AuthState(resData.Name,resData.Mobile,resData.Address,resData.Password,resData.UserType);
                        dispatch(AuthActions.setLoginData(authData));
                        let screenRoute = resData.UserType === 'Admin'?'Drawer':resData.UserType === 'Customer'?'CustomerOverview':'SupplierLogin';
                        props.navigation.navigate({
                            routeName : screenRoute
                        });
                    }
                    else {
                        setAutoLogin(false);
                        Alert.alert(
                            'Auto Login Failed',
                            'Mobile Number or Password is Incorrect please login !!',
                            [
                                { text: 'OK', onPress: () => {
                                    //console.log('OK Pressed')
                                } }
                            ],
                            { cancelable: false }
                        )
                    }
                }catch(err){
                    console.log(err);
                    setAutoLogin(false);
                    Alert.alert(
                        'Auto Login Failed',
                        'Mobile Number or Password is Incorrect please login !!',
                        [
                          { text: 'OK', onPress: () => {
                                //console.log('OK Pressed')
                            } }
                        ],
                        { cancelable: false }
                    )
                }
            }
            else {
                setAutoLogin(false);
            }
        } catch(e) {
        // read error
        }
    }
    // console.log(fectheduserName+' '+fetchpassword);
    
    const validateUser =  async () => {
        try {
            setLoading(true);
            const response = await fetch('https://milkbook-337d2-default-rtdb.firebaseio.com/usersLoginData/'+userName+'.json');
            const resData = await response.json();
            //console.log(resData);
            if(resData === null){
                throw new Error('Mobile Number is not registerd with us');
            }
            if(password === resData.Password) {
                try {
                    await AsyncStorage.multiSet([['UserName',resData.Mobile],['Password',resData.Password]]);
                    const authData = new AuthState(resData.Name,resData.Mobile,resData.Address,resData.Password,resData.UserType);
                    dispatch(AuthActions.setLoginData(authData))//.then(() => {
                        let screenRoute = resData.UserType === 'Admin'?'Drawer':resData.UserType === 'Customer'?'CustomerOverview':'SupplierLogin';
                        props.navigation.navigate({
                            routeName : screenRoute
                        });
                    //})
                    
                  } catch(e) {
                    throw e;
                  }
            }
            else {
                setLoading(false);
                
                Alert.alert(
                        'Login Failed',
                        'Mobile Number or Password is Incorrect',
                        [
                          { text: 'OK', onPress: () => {
                                console.log('OK Pressed')
                            } }
                        ],
                        { cancelable: false }
                )
            }
        }catch(err){
            console.log(err);
            setLoading(false);
            Alert.alert(
                'Login Failed',
                'Mobile Number is not registerd with us. Please contact Agent',
                [
                  { text: 'OK', onPress: () => {
                        console.log('OK Pressed')
                    } }
                ],
                { cancelable: false }
            )
        }
    }

    if(autologin) {
        return <View style = {{...styles.container,alignItems : 'center',justifyContent : 'center'}}>
            <ActivityIndicator size = 'large' color = 'white'/>
            <Text>Auto Logging</Text>
        </View>
        
    }

    return <View style= {styles.container}>
                <Spinner 
                size = {'large'}
                visible = { isLoading }
                textContent = { 'Logging...'}
                textStyle = {styles.SpinnerText}
                cancelable = {false}
                color = {Colours.primary2}
                animation = "fade"
                />
                <ImageBackground source={require('../assets/images/WhiteCircles.png')} style={styles.ImageContainer}>
                
                    {/* <View style={styles.logo}> */}
                        <Image source= {require('../assets/images/Logo.png')} style= {styles.Imagestyle}/>
                    {/* </View> */}
                    <KeyboardAvoidingView style={styles.Logincard}>
                        <Text style={styles.HeadingText}>Let's get started</Text>
                        <TextInput style={styles.textinputstyle} placeholder="Enter Your MobileNumber" keyboardType = 'numeric' maxLength = {10}
                        onChangeText = {(text)=>{setUserName(text)}} value = {userName}/>
                        <TextInput secureTextEntry= {true} style={styles.textinputstyle} placeholder="Enter Your password"
                        onChangeText = {(text) => {setPassword(text)}} value = {password}/>
                        <TouchableOpacity style={{width : '80%',alignItems:'flex-end'}}>
                        <Text style={styles.forgot}>Forgot Password?</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.buttoncontainer} onPress = {validateUser}>
                            <Text style={styles.buttontext}>Login</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>                    
                </ImageBackground>
            </View>

}

AuthScreen.navigationOptions = navData => {
    return {
        headerTitle : () => (
            <Text></Text>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor : Colours.primary,
        flex: 1
    },
    ImageContainer: {
        width:'100%',
        height:'100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    Imagestyle:{
        width: 300,
        height:300,
        resizeMode: 'contain',
        marginTop : 20
    },
    Logincard:{
        backgroundColor:'white',
        width: '100%',
        padding: 20,
        alignItems: 'center',
        borderTopLeftRadius:50,
        borderTopRightRadius:50
    },
    HeadingText:{
       fontSize:25,
       marginVertical:20,
       fontFamily : 'segoe-bold'
    },
    forgot:{
        color : Colours.primary,
        fontFamily : 'segoe-regular'
     },
    textinputstyle:{
        textAlign:'center',
        borderWidth:1,
        borderRadius:30,
        borderColor: Colours.primary,
        width: '80%',
        marginVertical:15,
        padding:10,
        fontSize: 18,
        fontFamily : 'segoe-regular'
    },
    buttoncontainer:{
        width:'40%',
        marginVertical:15,
        backgroundColor: Colours.primary,
        borderRadius:20,
        padding: 15,
        marginBottom:50
    },
    buttontext:{
        color: 'white',
        fontSize:25,
        fontFamily : 'segoe-bold',
        textAlign:'center'
    },
    SpinnerText: {
        color: Colours.primary2,
        fontFamily : 'segoe-bold'
    }
});

export default AuthScreen;