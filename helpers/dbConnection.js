import * as FireBase from 'firebase';

const DbInitialise = () => {

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
      FireBase.initializeApp(firebaseConfig);
}

export default DbInitialise;