import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck,
} from "firebase/app-check";
import _firebase from "firebase/compat/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
  storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.GATSBY_FIREBASE_APP_ID,
  measurementId: process.env.GATSBY_FIREBASE_MEASUREMENT_ID,
};

if (typeof window !== "undefined") {
  const app = _firebase.initializeApp(firebaseConfig);

  // Create a ReCaptchaEnterpriseProvider instance using your reCAPTCHA Enterprise
  // site key and pass it to activate()
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(
      process.env.GATSBY_RECAPTCHA_SITE_KEY as string,
    ),
    isTokenAutoRefreshEnabled: true, // Set to true to allow auto-refresh.
  });
}

// Configure FirebaseUI.
export const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // signInSuccessUrl: "/admin/profile",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    {
      provider: _firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: ["email"],
      customParameters: {
        hd: "soulcoffee.info",
      },
    },
  ],
};

export const firebase = _firebase;
