import firebase from 'firebase';

const firebaseConfig = {

        apiKey: "AIzaSyDvN3XGVrmrpy32AeuSjcM2-eDJqZhs9BM",
        authDomain: "parktix-26bdf.firebaseapp.com",
        databaseURL: "https://parktix-26bdf.firebaseio.com",
        projectId: "parktix-26bdf",
        storageBucket: "parktix-26bdf.appspot.com",
        messagingSenderId: "753666961708",
        appId: "1:753666961708:web:edec135995ad6157eb3c89"

};

  const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [{
        provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
        recaptchaParameters: {
            type: 'image',
            size: 'invisible',
            badge: 'bottomleft'
        },
        defaultCountry: 'IN'
    }],
};

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const firestore = firebaseApp.firestore();

  export { firebaseApp, uiConfig, firestore };