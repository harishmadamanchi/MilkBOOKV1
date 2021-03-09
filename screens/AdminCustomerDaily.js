import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Entypo } from '@expo/vector-icons';
import firebase from 'firebase';

import Colors from '../constants/Colors';

const AdminCustomerDaily = props => {

    const selectedId = props.navigation.getParam('CustomerId');

    const [milkDelivered, setMilkDelivered] = useState(0);
    const [prevmilkDelivered, setPrevMilkDelivered] = useState(0);
    const[monthCollection, setMonthCollection] = useState(0);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const CurrentDate = new Date();
    const [datePicked,setDatePicked] = useState(CurrentDate);

    useEffect(() => {
        fetchMilkDetails();
        fetchMonthlyTotal();
    },[datePicked])

    const fetchMilkDetails = async () => {
        const selectedDate = datePicked.toDateString();
        try {
            const response = await fetch('https://milkbook-337d2-default-rtdb.firebaseio.com/CustomerMilkDelivery/'+selectedId+'/'+selectedDate+'.json');
            const resData = await response.json();
            if(resData !== null){
                setPrevMilkDelivered(resData.MilkDelivered);
                setMilkDelivered(resData.MilkDelivered);
                console.log('InsidefecthDaily '+ milkDelivered)
            }
            else{
                setPrevMilkDelivered(0);
                setMilkDelivered(0);
            }
        }catch(err) {
            console.log('Error:'+err);
        }
    }

    const fetchMonthlyTotal = async() => {
        const selectedYear = datePicked.getFullYear();
        const selectedMonth = datePicked.getMonth()+1;
        try {
            const response = await fetch('https://milkbook-337d2-default-rtdb.firebaseio.com/CustomerMilkMonthlyDelivered/'+selectedId+'/'+selectedYear+'/'+selectedMonth+'.json');
            const resData = await response.json();
            if(resData !== null){
                setMonthCollection(resData.TotalDelivered);
                console.log('TotalDelivered '+ resData.TotalDelivered);
                //console.log('Calculation '+parseFloat(monthCollection)-parseFloat(prevMorningValue)-parseFloat(prevEveningValue)+parseFloat(morningSession)+parseFloat(eveningSession))
            }
        }catch(err) {
            console.log('Error:'+err);
        }
    }
    
    const dateSelection = date => {
        setDatePicked (date);
        setIsDatePickerVisible(false);
    }

    const DailyMilkDeliverHandler = () => {
        const selectedDate = datePicked.toDateString();
        firebase.database().ref('CustomerMilkDelivery/'+selectedId+'/'+selectedDate).set({
            MilkDelivered : parseFloat(milkDelivered).toFixed(2),
        }).then(() => {
            // fetchMonthlyTotal();
            const selectedYear = datePicked.getFullYear();
            const selectedMonth = datePicked.getMonth()+1;
            firebase.database().ref('CustomerMilkMonthlyDelivered/'+selectedId+'/'+selectedYear+'/'+selectedMonth).set({
                TotalDelivered : parseFloat(monthCollection)-parseFloat(prevmilkDelivered)+parseFloat(milkDelivered)
            }).then(() => {
                Alert.alert(
                    'Milk Delivered',
                    'Milk Delivered Successfully!!',
                    [
                        { text: 'OK', onPress: () => {
                            // console.log('OK Pressed')
                            props.navigation.navigate({
                                routeName: 'CustomerOverview'
                            })
                        } }
                    ],
                    { cancelable: false }
                );
            }).catch((err) => { throw err})
            
        }).catch((err) => { console.log(err) })
    }

    var img = null;//SelectedSupplier.photoURI === null ? null : SelectedSupplier.photoURI.split('/').pop();

    return (
        
            <View style = {Styles.container}>
                {/* <ImageBackground style = {Styles.bckImage} source = {require('../assets/images/BlueCircles.png')}> */}
                    <View style = {Styles.bluebackground}>
                        <View style= {Styles.ProfilePicContainer}>
                            <TouchableOpacity onPress = {()=>{}}>
                                <Image style = {Styles.ProfilePic} 
                                source = {img === 'man-icon.png' || img === null ? require('../assets/images/man-icon.png'):{uri : SelectedSupplier.photoURI}}/>
                            </TouchableOpacity>
                            <Text style = {Styles.nameText}>Harish</Text>
                        </View>
                    </View>
                    <TouchableOpacity style = {Styles.Date} onPress = {() => {setIsDatePickerVisible(true)}}>
                        <Text style = {Styles.pickedDate}>{datePicked.toDateString()}</Text>
                        {/* <TouchableOpacity style = {styles.downIcon} onPress = {() => {setIsDatePickerVisible(true)}}> */}
                            <Entypo name="triangle-down" size={28} color= 'black' />
                        {/* </TouchableOpacity> */}
                    </TouchableOpacity> 
                    <DateTimePickerModal
                        isVisible = { isDatePickerVisible }
                        maximumDate = {CurrentDate}
                        mode = "date"
                        onConfirm = {dateSelection}
                        onCancel = {() => {setIsDatePickerVisible(false)}} />
                    
                    <View style = {Styles.OverviewCard}>
                        <Text style = {Styles.sessionText}>Milk Delivered</Text>
                        <View style = {Styles.litreCollect}>
                            <Text style = {Styles.litreText}>Litres Delivered</Text>
                            <TextInput style = {Styles.litreInput} keyboardType = 'numeric' maxLength = {5} placeholder = '0.00' 
                            onChangeText = {text => setMilkDelivered(text)} value = {milkDelivered.toString()}/>
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity = {0.7} style={Styles.buttoncontainer} onPress = {DailyMilkDeliverHandler}>
                        <Text style={Styles.buttontext}>Delivered</Text>
                    </TouchableOpacity>
                {/* </ImageBackground> */}
            </View>
        
    )
}

const Styles = StyleSheet.create({
    container : {
        flex : 1
    },
    bckImage : {
        flex : 1
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
    nameText : {
        fontFamily : 'segoe-regular',
        fontSize : 25,
        color : 'white'
    },
    Date : {
        alignSelf : 'center',
        flexDirection : 'row',
        marginVertical : 30
    },
    pickedDate : {
        fontFamily : 'segoe-bold',
        paddingHorizontal : 10,
        fontSize : 24,
        color : 'black'//'#FF8C00'//'#CE0200'
    },
    OverviewCard : {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 20,
        backgroundColor: 'white',
        height: 150,
        marginHorizontal: 20,
        marginVertical : 15,
        overflow : 'hidden',
        alignItems : 'center'
    },
    buttoncontainer:{
        // width:'40%',
        marginVertical:30,
        backgroundColor: Colors.customerpage,
        borderRadius:20,
        padding: 15,
        marginBottom:50,
        alignSelf : 'center'
    },
    buttontext:{
        color: 'white',
        fontSize:35,
        textAlign:'center',
        fontFamily : 'segoe-bold',
        paddingHorizontal : 15
    },
    sessionText : {
        fontFamily : 'segoe-bold',
        fontSize : 20,
        color : '#ccc',
        padding : 20
    },
    litreCollect : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-evenly',
        width : '100%'
    },
    litreText : {
        fontFamily : 'segoe-bold',
        fontSize : 19,
        color : 'black',
        padding : 10
    },
    litreInput : {
        borderWidth : 1,
        borderColor : Colors.primary,
        paddingHorizontal: 30,
        paddingVertical : 5,
        fontFamily : 'segoe-bold',
        fontSize : 20,
        borderRadius : 10,
        textAlign : 'center',
        color : '#888'

    }
});

export default AdminCustomerDaily;