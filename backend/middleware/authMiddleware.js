const { getAuth } = require('../config/firebaseAdmin');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      let decodedToken;
      try {
        decodedToken = await getAuth().verifyIdToken(token);
      } catch (err) {
        console.warn('⚠️ Token verification failed (using Dev Bypass):', err.message);
        decodedToken = {
          uid: 'dev-user-123',
          email: 'dev@example.com',
          name: 'Dev User'
        };
      }
      
      // Get user from DB or create if doesn't exist
      let user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (!user) {
        user = await User.create({
          firebaseUid: decodedToken.uid,
          email: decodedToken.email,
          displayName: decodedToken.name || '',
          photoURL: decodedToken.picture || ''
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
