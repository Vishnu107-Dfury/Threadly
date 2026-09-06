const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const ratioRoutes = require('./routes/ratioRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://threadly.phynex.in',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((s) => s.trim()) : [])
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed =
      allowedOrigins.includes(origin) ||
      allowedOrigins.some((ao) => origin.startsWith(ao)) ||
      /\.vercel\.app$/.test(origin) ||
      /\.phynex\.in$/.test(origin) ||
      /localhost/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  optionsSuccessStatus: 200
};

// CORS Configuration (must be before helmet & rate limiter)
app.use(cors(corsOptions));

// Helmet Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(express.json());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/ratios', ratioRoutes);

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
