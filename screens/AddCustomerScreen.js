import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Text, Alert } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import firebase from 'firebase';
import Spinner from 'react-native-loading-spinner-overlay';

import Colors from '../constants/Colors';
import * as Actions from '../store/actions/Suppliers';
import Supplier from '../models/supplier';




const AddCustomerScreen = props => {

    const [imagePicked, setImagePicked] = useState(null);
    const [customerName, setCustomerName] = useState(null);
    const [mobileNumber, setMobileNumber] = useState(null);
    const [Address, setAddress] = useState(null);
    const [Spinnerstate, setSpinnerstate] = useState(false);
    const PickImage = async() => {
        let result = await ImagePicker.launchCameraAsync({
            // mediaTypes : ImagePicker.MediaTypeOptions.All,
            allowsEditing : true,
            aspect : [10,10],
            quality : 0.1
        });
        console.log(result);

        if(!result.cancelled){
            setImagePicked(result.uri);
        }
    }

    ///event handlers for text input
    const enteredCustomerNameHandler = (enteredName) => {
        setCustomerName(enteredName);
    }
    
    const enteredMobileNumberHandler = (enteredMobile) => {
        setMobileNumber(enteredMobile);
    }

    const enteredAddressHandler = (enteredAddress) => {
        setAddress(enteredAddress);
    }

    //to dispatch actions
    const dispatch = useDispatch();

    const DispatchAddCustomer = async () => {

        // console.log(imagePicked);
        const newCustomer = new Supplier(
            mobileNumber,
            customerName,
            imagePicked,
            mobileNumber,
            Address
        );

        const response = await fetch(imagePicked);
        const blob = await response.blob();
        setSpinnerstate(true);
        var imageStore =  firebase.storage().ref().child(mobileNumber).put(blob);
        imageStore.on('state_changed', (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
        }, 
        (error) => {
    // Handle unsuccessful uploads
        }, 
        () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            // let uploadedImageURL;
            imageStore.snapshot.ref.getDownloadURL().then((downloadURL) => {
                // uploadedImageURL = downloadURL;
            console.log('File available at', downloadURL);
            firebase.database().ref('Customers/'+mobileNumber).set({
                CustomerImage : downloadURL,
                CustomerName : customerName,
                CustomerMobile : mobileNumber,
                CustomerAddress : Address
            }).then(() => {
                console.log('Customer Inserted');
                dispatch(Actions.AddCustomer(newCustomer))//.then(()=>{
                    setSpinnerstate(false);
                    Alert.alert(
                        'Customer Created',
                        'Customer Created Successfully!!',
                        [
                          { text: 'OK', onPress: () => {
                                console.log('OK Pressed')
                                setAddress(null);setImagePicked(null);setMobileNumber(null);setCustomerName(null);
                                // props.navigation.goBack();
                                props.navigation.navigate({
                                    routeName: 'OverviewCustomers'
                                })
                            } }
                        ],
                        { cancelable: false }
                      );
                    
                // })
                // .catch((err) => {
                //     console.log('Error at insert to state: '+err);
                // })
                
            }).catch((err) => {
                console.log(err);
            })
        });
    }
    );
        
    }

    return (
        <View style = {Styles.Container}>
            <Spinner 
            size = {'large'}
            visible = { Spinnerstate }
            textContent = { 'Uploading...'}
            textStyle = {Styles.SpinnerText}
            cancelable = {false}
            color = {Colors.primary2}
            animation = "fade"
            />
            <View style = {Styles.bluebackground}>
                <View style= {Styles.ProfilePicContainer}>
                    <TouchableOpacity onPress = {PickImage}>
                        <Image style = {Styles.ProfilePic} 
                        source = {imagePicked === null ? require('../assets/images/man-icon.png'):{uri : imagePicked}}/>
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {Styles.dataContainer}>
                <TextInput style = {Styles.editBox} 
                placeholder = 'Customer Name' onChangeText = {enteredCustomerNameHandler}
                value = { customerName }/>
                <TextInput style = {Styles.editBox} 
                placeholder = 'Mobile Number' keyboardType = 'numeric' maxLength = {10}
                onChangeText = {enteredMobileNumberHandler}
                value = {mobileNumber}/>
                <TextInput style = {Styles.editBox} placeholder = 'Address' 
                onChangeText = {enteredAddressHandler}
                value = { Address }/>
                
            </View>
            <TouchableOpacity style={Styles.buttoncontainer} onPress = {DispatchAddCustomer}>
                <Text style={Styles.buttontext}>Add Customer</Text>
            </TouchableOpacity>
        </View>
    )
}

AddCustomerScreen.navigationOptions = navData => {
    return {
        headerTitle : () => (
            <Image 
            resizeMode = 'cover'
            style = {Styles.headerImage}
            source = {require('../assets/images/Logo.png')}/>
        ),
        headerRight : () => (
            <TouchableOpacity style = {Styles.DotContainer}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
            </TouchableOpacity>
        ),
        headerLeft : () => (
            <TouchableOpacity style = {Styles.menu} onPress = {()=>{navData.navigation.toggleDrawer()}}>
                <SimpleLineIcons name="menu" size={24} color="white" />
            </TouchableOpacity>
        )
    }
}

const Styles = StyleSheet.create({
    SpinnerText: {
        color: Colors.customerpage,
        fontFamily : 'segoe-bold'
    },
    headerImage : {
        width : 100,
        height : 50,
        resizeMode : 'contain',
        alignSelf : 'center'
    },
    DotContainer : {
        marginRight : 10
    },
    Image : {
        width : 40,
        height : 40,
        resizeMode : 'contain'
    },
    menu : {
        marginLeft : 10
    },
    Container : {
        width : '100%',
        height : '100%',
        backgroundColor : 'white',
    },
    bluebackground : {
        backgroundColor : Colors.customerpage,
        width : '100%',
        height : 200,
        borderBottomLeftRadius : 300,
        borderBottomRightRadius : 300,
        justifyContent : 'center',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
    },
    ProfilePicContainer : {
        alignItems : 'center',
        alignSelf : 'center'
    },
    ProfilePic : {
        width : 140,
        height : 140,
        borderRadius : 140 /2,
        borderColor : 'white',
        borderWidth : 2
    },
    dataContainer : {
        alignItems : 'center',
        marginVertical : 30,
        marginHorizontal : 30
    },
    editBox : {
        marginVertical : 20,
        width : '100%',
        paddingHorizontal : 20,
        height : 50,
        fontSize : 20,
        fontFamily : 'segoe-regular',
        borderBottomColor : Colors.customerpage,
        borderBottomWidth : 1,
        borderBottomLeftRadius : 15,
        borderBottomRightRadius : 15
    },
    buttoncontainer:{
        // width:'40%',
        marginTop:30,
        backgroundColor: Colors.customerpage,
        borderRadius:20,
        padding: 15,
        marginBottom:50,
        alignSelf : 'center'
    },
    buttontext:{
        color: 'white',
        fontSize:25,
        textAlign:'center',
        fontFamily : 'segoe-bold'
    }
});

export default AddCustomerScreen;