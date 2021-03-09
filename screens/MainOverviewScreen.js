import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Entypo } from '@expo/vector-icons';
import Call from 'react-native-phone-call';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import  Colors  from '../constants/Colors';
import SupplierCardItem from '../components/SupplierCardItem';
import * as SupplierActions from '../store/actions/Suppliers';
import { useSelector, useDispatch } from 'react-redux';

const MainOverviewScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const CurrentDate = new Date();
    const [datePicked,setDatePicked] = useState(CurrentDate);

    const dispatch = useDispatch();
    useEffect(() => {
        getSuppliers();
    },[dispatch,datePicked])

    const getSuppliers = () => {
        setIsLoading(true);
        dispatch(SupplierActions.fetchSuppliers()).then(()=>{ setIsLoading(false)});
    }
    
    const supplier = useSelector(state => state.supplier.Suppliers);
    const authObject = useSelector(state =>state.authReducer.Auth);


    const GoToPhoneCall = (mobile) => {
        const args = {
            number : mobile,
            prompt : true
        }
        Call(args).catch(console.error);
    }
    
    
    const SignOutHandler = useCallback(async () => {
        try{
            await AsyncStorage.multiRemove(['UserName','Password']);
            console.log('Done');
            props.navigation.navigate({
                routeName : 'Auth'
            })
        }catch(err){

        }
    },[])

    useEffect(() => {
        props.navigation.setParams({ SignOut: SignOutHandler })
    },[])
    

    const GotoDailyCollection = ( id, mobile ) => {
        props.navigation.navigate({
            routeName : 'SupplierDaily',
            params : {
                supplierId : id,
                dateSelected : datePicked,
                mobile : mobile
            }
        });
    }

    const dateSelection = date => {
        setDatePicked (date);
        setIsDatePickerVisible(false);
    }

    let date = new Date();
    let wish;
    if(date.getHours()>=2 && date.getHours()<12){
        wish = 'Good Morning !';
    }
    else if(date.getHours()>=12 && date.getHours()<16){
        wish = 'Good Afternoon !';
    }
    else {
        wish = 'Good Evening !';
    }

    if(isLoading){
        return <View style = {styles.spinnerContainer}>
            <ActivityIndicator size = 'large' color = {Colors.primary2}/>
        </View>
    }

    return (
        <View style = {styles.OverviewContainer}>
            <View style = {styles.WishContainer}>
                <Text style = {styles.Wish}>{wish}</Text>
                <Text style = {styles.Wish}>{ authObject.Name }</Text>
            </View>
            <View style = {styles.OverviewCard}>
                <Text style = {styles.OVtext}>Overview</Text>
                <TouchableOpacity style = {styles.Date} onPress = {() => {setIsDatePickerVisible(true)}}>
                    <Text style = {styles.pickedDate}>{datePicked.toDateString()}</Text>
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
                <View style = {styles.LitersContainer}>
                    <View style = {styles.litreCard}>
                        <View style = {{padding : 5}}>
                            <Text style = {styles.numeric}>168</Text>
                        </View>
                        <View style = {{padding : 5}}>
                            <Text style = {styles.sideText}>Current</Text>
                            <Text style = {styles.sideText}>Month</Text>
                        </View>
                    </View>
                    <View style = {styles.litreCard}>
                        <View style = {{padding : 5}}>
                            <Text style = {styles.numeric}>068</Text>
                        </View>
                        <View style = {{padding : 5}}>
                            <Text style = {styles.sideText}>Current</Text>
                            <Text style = {styles.sideText}>Day</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style = {{marginLeft : 10, paddingLeft : 10}}>
                <Text style = {styles.Wish}>Suppliers</Text>
                
            </View>
            <FlatList
            onRefresh = {getSuppliers}
            refreshing = {isLoading}
            data = {supplier}
            keyExtractor = {item => item.id}
            renderItem = {itemData => <SupplierCardItem name = {itemData.item.name}
            mobile = {itemData.item.mobile} imageuri = {itemData.item.photoURI} 
            supMilkId = {itemData.item.id}
            dateShown = { datePicked}
            contactNumber = { GoToPhoneCall.bind(this,itemData.item.mobile) }
            onClickOfAdd = {GotoDailyCollection.bind(this,itemData.item.id,itemData.item.mobile)} 
            />}/>
        </View>
    );
}

MainOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle : () => (
            <Image 
            resizeMode = 'cover'
            style = {styles.headerImage}
            source = {require('../assets/images/Logo.png')}/>
        ),
        headerRight : () => (
            <TouchableOpacity style = {styles.ImageContainer} onPress = {  () => {
                Alert.alert(
                    'SignOut',
                    'Do you want to SignOut?',
                    [
                        { text: 'Cancel', onPress: () => {
                            console.log('Cancel Pressed')
                        } },
                        { text: 'OK', onPress: async () => {
                            console.log('OK Pressed')
                            try{
                                await AsyncStorage.multiRemove(['UserName','Password']);
                                console.log('Done');
                                navData.navigation.navigate({
                                    routeName : 'Auth'
                                })
                            }catch(err){
                    
                            }
                        } }
                    ],
                    { cancelable: false }
                );
                
             }}>
                <Ionicons name="md-power" size={28} color="white" />
            </TouchableOpacity>
        ),
        headerLeft : () => (
            <TouchableOpacity style = {styles.menu} onPress = {()=>{navData.navigation.toggleDrawer()}}>
                <SimpleLineIcons name="menu" size={24} color="white" />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    spinnerContainer : {
        flex :1,
        alignItems : 'center',
        justifyContent : 'center'
    },
    headerImage : {
        width : 100,
        height : 50,
        resizeMode : 'contain',
        alignSelf : 'center'
    },
    OverviewContainer : {
        flex : 1,
        backgroundColor : 'white'
    },
    WishContainer : {
        justifyContent : 'center',
        margin : 10,
        flexDirection : 'row'
    },
    Wish : {
        fontSize : 22,
        paddingVertical : 10,
        paddingHorizontal: 5,
        fontFamily : 'segoe-bold'
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
        borderRadius: 10,
        backgroundColor: 'white',
        height: 180,
        margin: 10,
        overflow : 'hidden'
    },
    OVtext : {
        fontSize : 20,
        padding : 10,
        color : Colors.primary,
        fontFamily : 'segoe-bold'
    },
    Date : {
        alignSelf : 'center',
        flexDirection : 'row'

    },
    LitersContainer :{
        flexDirection : 'row',
        justifyContent : 'space-around',
        marginTop : 10
    },
    litreCard : {
        flexDirection : 'row',
        padding :10,
        backgroundColor : 'white',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        width : 130
    },
    numeric : {
        fontSize : 32,
        color : Colors.primary,
        fontFamily : 'segoe-bold'
    },
    sideText : {
        fontFamily : 'segoe-regular'
    },
    ImageContainer : {
        marginRight : 10,
    },
    Image : {
        width : 50,
        height : 50,
        resizeMode : 'contain'
    },
    menu : {
        marginLeft : 10
    }
});

export default MainOverviewScreen;