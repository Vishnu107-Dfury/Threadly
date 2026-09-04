// Override DNS to use Google's DNS servers - fixes MongoDB SRV resolution on some networks
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const { initFirebaseAdmin } = require('./config/firebaseAdmin');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize Database
    await connectDB();
    
    // Initialize Firebase Admin
    initFirebaseAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
