import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCONqfNXX-RGfLfapei-K2Yi8aK-KJrGDE",
    authDomain: "project-6757960052769325295.firebaseapp.com",
    databaseURL: "https://project-6757960052769325295.firebaseio.com",
    projectId: "project-6757960052769325295",
    storageBucket: "project-6757960052769325295.appspot.com",
    messagingSenderId: "943879760644"
};

const FireBaseApp  = firebase.initializeApp(config);

export default FireBaseApp;
