const admin = require("firebase-admin");
const serviceAccount = require("C:/Users/DELL/Desktop/creds.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Connect DB
const firestore = admin.firestore();
module.exports = firestore;


