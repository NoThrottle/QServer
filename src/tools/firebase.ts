const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

import serviceAccount from '../resources/queue-management-735a4-firebase-adminsdk-8gtob-796be7c535.json';

initializeApp({
  credential: cert(serviceAccount)
});

export const db = getFirestore();
