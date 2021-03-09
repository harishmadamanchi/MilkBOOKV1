import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Platform } from 'react-native';


import MainOverviewScreen from '../screens/MainOverviewScreen';
import SupplierDailyCollectionScreen from '../screens/SupplierDailyCollectionScreen';
import AddSupplierScreen from '../screens/AddSupplierScreen';
import AddCustomerScreen from '../screens/AddCustomerScreen';
import AuthScreen from '../screens/AuthScreen';
import CustomerViewingScreen from '../screens/CustomerViewingScreen';
import SupplierViewingScreen from '../screens/SupplierViewingScreen';
import CustomersOverviewScreen from '../screens/CustomersOverviewScreen';
import CustomersDailyDetailScreen from '../screens/AdminCustomerDaily';
import Colors from '../constants/Colors';

const defaultNavOptions = {
        headerStyle : {
            backgroundColor : Platform.OS === 'android' ? Colors.primary : 'white',
            elevation : 0,
            shadowOpacity : 0
        }
}

const defaultNavOptionsforCustomerPages = {
    headerStyle : {
        backgroundColor : Platform.OS === 'android' ? Colors.customerpage : 'white',
        elevation : 0,
        shadowOpacity : 0
    }
}

const MilkNavigator = createStackNavigator (
    {
        SupplierOverView : MainOverviewScreen,
        SupplierDaily : SupplierDailyCollectionScreen
    },{
        defaultNavigationOptions : defaultNavOptions
    }
);

const AddSupplierNavigator = createStackNavigator (
    {
        AddSupplier : AddSupplierScreen
    },
    {
        defaultNavigationOptions : defaultNavOptions
    }
)

const AddCustomerNavigator = createStackNavigator (
    {
        AddCustomer : AddCustomerScreen
    },
    {
        defaultNavigationOptions : defaultNavOptionsforCustomerPages
    }
)

const OverviewCustomerNavigator = createStackNavigator (
    {
        CustomerOverview : CustomersOverviewScreen,
        CustomerDailyDetails : CustomersDailyDetailScreen
    },
    {
        defaultNavigationOptions : defaultNavOptionsforCustomerPages
    }
)

const MilkDrawerNavigation = createDrawerNavigator (
    {
        OverviewNavigator : MilkNavigator,
        AddSupplier : AddSupplierNavigator,
        AddCustomer : AddCustomerNavigator,
        OverviewCustomers : OverviewCustomerNavigator
    },{
        drawerType : 'slide',
        drawerWidth : '40%'
    }
);

const AuthNavigator = createStackNavigator(
    {
        Auth : AuthScreen
    },{
        defaultNavigationOptions : defaultNavOptions
    }
)

const CustomerNavigator = createStackNavigator(
    {
        Customer : CustomerViewingScreen
    },{
        defaultNavigationOptions : defaultNavOptions
    }
)

const SupplierNavigation = createStackNavigator(
    {
        Supplier : SupplierViewingScreen
    },{
        defaultNavigationOptions : defaultNavOptions
    }
)

const MainNavigator = createSwitchNavigator(
    {
        Auth : AuthNavigator,
        Drawer : MilkDrawerNavigation,
        CustomerOverview : CustomerNavigator,
        SupplierLogin : SupplierNavigation
    }
)

export default createAppContainer(MainNavigator);