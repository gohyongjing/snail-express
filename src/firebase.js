import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, /*enableIndexedDbPersistence*/ } from "firebase/firestore"

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const firestore = getFirestore(app);
/*enableIndexedDbPersistence(firestore)
  .catch((err) => {
      console.log(`Failed to enable offline persistence: ${err}`)
  });*/

export default app;