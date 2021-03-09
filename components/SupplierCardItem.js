import React, { useEffect, useState, useCallback } from 'react';
import { View, Button, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import {useSelector} from 'react-redux';


import Colors from '../constants/Colors';

const SupplierCardItem = props => {

    const [dailyCollection,setDailyCollection] = useState(0);
    const [monthCollection,setMonthCollection] = useState(0);

    const datesel = props.dateShown.toDateString();
    const yearSel = props.dateShown.getFullYear();
    const monSel = props.dateShown.getMonth() +1;

    useEffect(() => {
        fetchDailyDetails();
        fecthMonthDetails();
    },[])
    
    const fetchDailyDetails = useCallback(async () => {
        try{
            const response = await fetch('https://milkbook-337d2-default-rtdb.firebaseio.com/MilkCollection/'+props.mobile+'/'+datesel+'.json');
            const resData = await response.json();
            if(resData !== null){
                const todayTotal = parseFloat(resData.eveningCollection) + parseFloat(resData.morningCollection);
                setDailyCollection(todayTotal);
            }
        }catch(err) {
            console.log(err);
        }
    },[]);
    
    const fecthMonthDetails = useCallback(async () => {
        try{
            const response = await fetch('https://milkbook-337d2-default-rtdb.firebaseio.com/MilkMonthlyCollection/'+props.mobile+'/'+yearSel+'/'+monSel+'.json');
            const resData = await response.json();
            if(resData !== null){
                setMonthCollection(resData.TotalCollection);
            }
        }catch(err) {
            console.log(err);
        }
    },[]);

    var img = props.imageuri === null ? null : props.imageuri.split('/').pop();
    return (
        <View style = {Styles.cardItem}>
            <View style = {Styles.Supplierdetails}>
                <View style = {Styles.nameContainer}>
                    <View style = {Styles.ImageContainer}>
                        <Image style = {Styles.Image} 
                        source = {img=== 'man-icon.png' || img === null ? require('../assets/images/man-icon.png') : {uri : props.imageuri}}/>
                    </View>
                    <Text style = {Styles.name}>{props.name}</Text>
                </View>
                <TouchableOpacity style = {Styles.numberContainer} onPress = { props.contactNumber }>
                    <FontAwesome style = {Styles.mobileIcon} name="phone" size={30} color= {Colors.primary} />
                    <Text style = {Styles.Mobile}>{props.mobile}</Text>
                </TouchableOpacity>
            </View>
            <View style = {Styles.litersdetails}>
                <View style = {Styles.litreCard}>
                    <View style = {{padding : 5}}>
                        <Text style = {Styles.numeric}>{ monthCollection.toString() }</Text>
                    </View>
                    <View style = {{padding : 5}}>
                        <Text style = {Styles.cardtext}>Current</Text>
                        <Text style = {Styles.cardtext}>Month</Text>
                    </View>
                </View>
                <View style = {Styles.litreCard}>
                    <View style = {{padding : 5}}>
                        <Text style = {Styles.numeric}>{ dailyCollection.toString() }</Text>
                    </View>
                    <View style = {{padding : 5}}>
                        <Text style = {Styles.cardtext}>Current</Text>
                        <Text style = {Styles.cardtext}>Day</Text>
                    </View>
                </View>
                <View style = {Styles.plusicon}>
                    <TouchableOpacity onPress = {props.onClickOfAdd}>
                        <FontAwesome name="plus" size={60} color= "green" />
                    </TouchableOpacity>
                    </View>
            </View>
        </View>
    );
}

const Styles = StyleSheet.create({
    cardItem : {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        height: 180,
        margin: 10,
        overflow : 'hidden',
        padding: 10
    },
    Supplierdetails : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center'
    },
    nameContainer : {
        flexDirection : 'row',
        alignItems : 'center',
        paddingHorizontal : 5
    },
    ImageContainer : {
        borderRadius : 25,
        marginRight : 10,
        overflow : 'hidden'
    },
    Image : {
        width : 50,
        height : 50,
        resizeMode : 'contain',
        
    },
    numberContainer : {
        flexDirection : 'row',
        height : '100%',
        alignItems : 'center',
        paddingHorizontal : 5
    },
    mobileIcon : {
        paddingHorizontal : 5
    },
    litersdetails : {
        flexDirection : 'row',
        marginTop : 20,
        justifyContent : 'space-between',
        alignItems : 'center'
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
        width : 130,
        backgroundColor : Colors.primary
    },
    numeric : {
        fontSize : 30,
        color : 'white',
        fontFamily : 'segoe-bold'
    },
    cardtext : {
        color : 'white',
        fontFamily : 'segoe-regular'
    },
    plusicon : {
        paddingRight : 30
    },
    name : {
        fontFamily : 'segoe-regular',
        fontSize : 25
    },
    Mobile : {
        fontFamily : 'segoe-regular',
        fontSize : 20
    }
});

export default SupplierCardItem;