import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Call from 'react-native-phone-call';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Actions from '../store/actions/Suppliers';
import Colors from '../constants/Colors';
import CustomerCardItem from '../components/CustomerCardItem';



const CustomersOverviewScreen = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        setIsLoading(true);
        getCustomers();
        setIsLoading(false)
    },[])

    const GoToPhoneCall = (mobile) => {
        const args = {
            number : mobile,
            prompt : true
        }
        Call(args).catch(console.error);
    }

    const GotoDailyDelivery = (id) => {
        props.navigation.navigate({
            routeName : 'CustomerDailyDetails',
            params : {
                CustomerId : id
            }
        })
    }
    
    const dispatch = useDispatch();

    const getCustomers = () => {
        setIsRefreshing(true);
        dispatch(Actions.fetchCustomers()).then(() => setIsRefreshing(false))
    }

    const Customers = useSelector(state => state.supplier.Customers);
    
    // const CustomersLength = Customers.length
    // console.log(CustomersLength)

    if(isLoading){
        return <View style = {Styles.spinnerContainer}>
            <ActivityIndicator size = 'large' color = {Colors.customerpage}/>
        </View>
    }

    return <View style = {Styles.Container}>
        {/* <View style = {Styles.WishContainer}>
            <Text style = {Styles.Wish}>Total Customers </Text>
            <Text style = {Styles.Wish}>{CustomersLength}</Text>
        </View> */}
        <FlatList
        data = {Customers}
        onRefresh = {getCustomers}
        refreshing = {isRefreshing}
        keyExtractor = {item => item.id}
        renderItem = {itemData => <CustomerCardItem 
            name = {itemData.item.name}
            mobile = {itemData.item.mobile} imageuri = {itemData.item.photoURI} 
            supMilkId = {itemData.item.id}
            // dateShown = { datePicked}
            contactNumber = { GoToPhoneCall.bind(this,itemData.item.mobile) }
            onClickOfAdd = {GotoDailyDelivery.bind(this,itemData.item.id)}
            />}/>
        
    </View>
}

CustomersOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle : () => (
            <Image 
            resizeMode = 'cover'
            style = {Styles.headerImage}
            source = {require('../assets/images/Logo.png')}/>
        ),
        headerRight : () => (
            <TouchableOpacity style = {Styles.ImageContainer} onPress = {  () => {
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
            <TouchableOpacity style = {Styles.menu} onPress = {()=>{navData.navigation.toggleDrawer()}}>
                <SimpleLineIcons name="menu" size={24} color="white" />
            </TouchableOpacity>
        )
    }
}

const Styles = StyleSheet.create({
    headerImage : {
        width : 100,
        height : 50,
        resizeMode : 'contain',
        alignSelf : 'center'
    },
    Image : {
        width : 50,
        height : 50,
        resizeMode : 'contain'
    },
    menu : {
        marginLeft : 10
    },
    ImageContainer : {
        marginRight : 10,
    },
    spinnerContainer : {
        flex :1,
        alignItems : 'center',
        justifyContent : 'center'
    },
    Container : {
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
    }
});
export default CustomersOverviewScreen;
