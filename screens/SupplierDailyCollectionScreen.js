import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ImageBackground, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';

import Colors from '../constants/Colors';



const SupplierDailyCollectionScreen = props =>{

    const selectedId = props.navigation.getParam('supplierId');
    const selecteddate = props.navigation.getParam('dateSelected').toDateString();
    const selectedMonth = parseInt(props.navigation.getParam('dateSelected').getMonth()) + 1;
    const selectedYear =  props.navigation.getParam('dateSelected').getFullYear();
    //const selectedmobile = props.navigation.getParam('mobile');
    const SelectedSupplier = useSelector(state => state.supplier.Suppliers.find(suppiler => suppiler.id === selectedId));
    var img = SelectedSupplier.photoURI === null ? null : SelectedSupplier.photoURI.split('/').pop();
    //const viewSuppDetails = useSelector(state => state.milkCollection.MilkCollection.find(milksup => milksup.Suppid === selectedId).find(milkdate => milkdate.DateCollected === CurrentDate ));

    const[prevMorningValue,setPrevMorningValue] = useState(0);
    const[prevEveningValue,setPrevEveningValue] = useState(0);
    const[monthCollection, setMonthCollection] = useState(0);
    const [morningSession, setMorningSession] = useState(0);
    const [eveningSession, setEveningSession] = useState(0); 

    

    useEffect(() => {
        fetchMilkDetails();
        fetchMonthlyTotal();
    },[])

    const fetchMilkDetails = async () => {
        try {
            const response = await fetch('https://milkbook-337d2-default-rtdb.firebaseio.com/MilkCollection/'+selectedId+'/'+selecteddate+'.json');
            const resData = await response.json();
            if(resData !== null){
                setPrevMorningValue(resData.morningCollection);
                setPrevEveningValue(resData.eveningCollection);
                setMorningSession(resData.morningCollection);
                setEveningSession(resData.eveningCollection);
            }
        }catch(err) {
            console.log('Error:'+err);
        }
    }

    const fetchMonthlyTotal = async() => {
        try {
            const response = await fetch('https://milkbook-337d2-default-rtdb.firebaseio.com/MilkMonthlyCollection/'+selectedId+'/'+selectedYear+'/'+selectedMonth+'.json');
            const resData = await response.json();
            if(resData !== null){
                setMonthCollection(resData.TotalCollection);
                console.log('TotalCollection '+ resData.TotalCollection);
                console.log('Calculation '+parseFloat(monthCollection)-parseFloat(prevMorningValue)-parseFloat(prevEveningValue)+parseFloat(morningSession)+parseFloat(eveningSession))
            }
        }catch(err) {
            console.log('Error:'+err);
        }
    }

    const DailyMilkCollectHandler = () => {
        
        firebase.database().ref('MilkCollection/'+selectedId+'/'+selecteddate).set({
            morningCollection : parseFloat(morningSession).toFixed(2),
            eveningCollection : parseFloat(eveningSession).toFixed(2)
        }).then(() => {
            // fetchMonthlyTotal();
            firebase.database().ref('MilkMonthlyCollection/'+selectedId+'/'+selectedYear+'/'+selectedMonth).set({
                TotalCollection : parseFloat(monthCollection)-parseFloat(prevMorningValue)-parseFloat(prevEveningValue)+parseFloat(morningSession)+parseFloat(eveningSession)
            }).then(() => {
                Alert.alert(
                    'Milk Collected',
                    'Milk is Collected and Stored Successfully!!',
                    [
                        { text: 'OK', onPress: () => {
                            console.log('OK Pressed')
                            props.navigation.navigate({
                                routeName: 'SupplierOverView'
                            })
                        } }
                    ],
                    { cancelable: false }
                );
            }).catch((err) => { throw err})
            
        }).catch((err) => { console.log(err) })
    }

    return(
        <View style = {Styles.container}>
            <ImageBackground style = {Styles.bckImage} source = {require('../assets/images/BlueCircles.png')}>
            <View style = {Styles.bluebackground}>
                <View style= {Styles.ProfilePicContainer}>
                    <TouchableOpacity onPress = {()=>{}}>
                        <Image style = {Styles.ProfilePic} 
                        source = {img === 'man-icon.png' || img === null ? require('../assets/images/man-icon.png'):{uri : SelectedSupplier.photoURI}}/>
                    </TouchableOpacity>
                    <Text style = {Styles.nameText}>{SelectedSupplier.name}</Text>
                </View>
            </View>
            <ScrollView>
                <View style = {Styles.OverviewCard}>
                    <Text style = {Styles.sessionText}>Morning Session</Text>
                    <View style = {Styles.litreCollect}>
                        <Text style = {Styles.litreText}>Litres Collected</Text>
                        <TextInput style = {Styles.litreInput} keyboardType = 'numeric' maxLength = {5} placeholder = '0.00' 
                        onChangeText = {text => setMorningSession(text)} value = {morningSession.toString()}/>
                    </View>
                </View>
                <View style = {Styles.OverviewCard}>
                    <Text style = {Styles.sessionText}>Evening Session</Text>
                    <View style = {Styles.litreCollect}>
                        <Text style = {Styles.litreText}>Litres Collected</Text>
                        <TextInput style = {Styles.litreInput} keyboardType = 'numeric' maxLength = {5} placeholder = '0.00'
                        onChangeText = {text => setEveningSession(text)} value = {eveningSession.toString()}/>
                    </View>
                </View>
                <TouchableOpacity activeOpacity = {0.7} style={Styles.buttoncontainer} onPress = {DailyMilkCollectHandler}>
                    <Text style={Styles.buttontext}>Collect</Text>
                </TouchableOpacity>
            </ScrollView>
            </ImageBackground>
        </View>
    );
}


const Styles = StyleSheet.create({
    container : {
        flex : 1
    },
    bckImage : {
        flex : 1
    },
    bluebackground : {
        backgroundColor : Colors.primary,
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
        backgroundColor: Colors.primary,
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

export default SupplierDailyCollectionScreen;