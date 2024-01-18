import { initializeApp } from 'firebase/';

const firebaseConfig = {
    apiKey: "AIzaSyAHg9NuWqJagATfRk8qqP7usRKD64eRlv8",
    authDomain: "todolisttemp.firebaseapp.com",
    projectId: "todolisttemp",
    storageBucket: "todolisttemp.appspot.com",
    messagingSenderId: "112573893014",
    appId: "1:112573893014:web:40ae00e61a526a7412f5b7",
    measurementId: "G-0CCET1WDB5"
  };

const app = initializeApp(firebaseConfig);

export { app }; // Export the initialized Firebase app
