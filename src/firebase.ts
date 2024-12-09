import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import * as dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export const firestoreConfig = {
  storagePaths: {
    productionImagesRootPath: "images/products",
    testProductsImagesRootPath: "test-images/products",
    allProductsImages(productId: string) {
      return `${this.productionImagesRootPath}/${productId}`;
    },
    productImage(productId: string | number, fileName: string) {
      return `${this.productionImagesRootPath}/${productId}/${fileName}`;
    },
    testProductsImages(productId: string) {
      return `${this.testProductsImagesRootPath}/${productId}`;
    },
    testProductImage(productId: string | number, fileName: string) {
      return `${this.testProductsImagesRootPath}/${productId}/${fileName}`;
    },
  },
};

const app = initializeApp(firebaseConfig);

export const firestoreDb = getFirestore(app);
export const storage = getStorage(app);
