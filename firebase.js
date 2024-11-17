"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageRef = exports.storage = exports.firestoreDb = exports.firestoreConfig = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const storage_1 = require("firebase/storage");
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};
exports.firestoreConfig = {
    storagePaths: {
        productImage(productId, fileName) {
            `images/products/${productId}/${fileName}`;
        },
    },
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.firestoreDb = (0, firestore_1.getFirestore)(app);
exports.storage = (0, storage_1.getStorage)(app);
const storageRef = (path) => (0, storage_1.ref)(exports.storage, path);
exports.storageRef = storageRef;
//# sourceMappingURL=firebase.js.map