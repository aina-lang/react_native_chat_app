import { initializeApp, getApps } from 'firebase/app'

import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
//import Constants from 'expo-constants';

const firebaseConfig = {
    apiKey: "AIzaSyDT-RTcwXSSqx2BbIRBreZo9mo3Xo9mBEs",
    authDomain: "chatapp-c84b0.firebaseapp.com",
    projectId: "chatapp-c84b0",
    storageBucket: "chatapp-c84b0.appspot.com",
    messagingSenderId: "508454615088",
    appId: "1:508454615088:web:f141b1a202945c38f915f5"
};

if ( !getApps().length ) initializeApp( firebaseConfig )
export const auth = getAuth();
export const database = getFirestore();
