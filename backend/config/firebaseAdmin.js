const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const initFirebaseAdmin = () => {
  // In firebase-admin v12+, use getApps() instead of admin.apps
  if (getApps().length === 0) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        console.warn('⚠️  Firebase Admin credentials incomplete. Auth middleware will fail.');
        return;
      }

      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        })
      });

      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase Admin initialization error:', error.message);
    }
  }
};

module.exports = { getAuth, initFirebaseAdmin };
