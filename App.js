import React, {useState} from 'react';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

import MilkNavigator from './navigation/MilkNavigator';
import supplierReducer from './store/reducers/Suppliers';
import MilkCollectionReducer from './store/reducers/MilkCollection';
import AuthReducer from './store/reducers/authReducer';
import firebase from 'firebase';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs([
  "Your project is accessing the following APIs from a deprecated global rather than a module import: Constants (expo- constants).",
]);

try{
  var firebaseConfig = {
    apiKey: "AIzaSyBshblTYbdfOXsit9iV52Y0IraQE3ZFcuE",
    authDomain: "milkbook-337d2.firebaseapp.com",
    projectId: "milkbook-337d2",
    storageBucket: "milkbook-337d2.appspot.com",
    messagingSenderId: "18090990450",
    appId: "1:18090990450:web:78b22e680901bd944d1beb",
    measurementId: "G-V7KJCJCTHX"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}catch(err) {
  // we skip the "already exists" message which is
// not an actual error when we're hot-reloading
if (!/already exists/.test(err.message)) {
  console.error('Firebase initialization error raised', err.stack)
  }
}

const rootReducer = combineReducers({
  supplier : supplierReducer,
  milkCollection : MilkCollectionReducer,
  authReducer : AuthReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const customfonts = () => {
  return Font.loadAsync({
    'segoe-regular' : require('./assets/fonts/segoe-ui.ttf'),
    'segoe-bold' : require('./assets/fonts/segoe-ui-bold.ttf'),
    'logo' : require('./assets/images/Logo.png'),
    'man-icon' : require('./assets/images/man-icon.png')
  })
};

export default function App() {

  // useEffect(()=> {
  //   var firebaseConfig = {
  //     apiKey: "AIzaSyBshblTYbdfOXsit9iV52Y0IraQE3ZFcuE",
  //     authDomain: "milkbook-337d2.firebaseapp.com",
  //     projectId: "milkbook-337d2",
  //     storageBucket: "milkbook-337d2.appspot.com",
  //     messagingSenderId: "18090990450",
  //     appId: "1:18090990450:web:78b22e680901bd944d1beb",
  //     measurementId: "G-V7KJCJCTHX"
  //   };
  //   // Initialize Firebase
  //   firebase.initializeApp(firebaseConfig);
  // },[])

  const [isFontloaded, setFontLoaded] = useState(false);

  if(!isFontloaded){
    return <AppLoading startAsync = {customfonts}
    onFinish = {() => setFontLoaded(true)} onError = {(err) => console.log(err)}/>
  }
  return (
    <Provider store = { store }>
      <MilkNavigator/>
    </Provider>
  );
}