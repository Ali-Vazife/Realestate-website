const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit'); //npm
const helmet = require('helmet'); //npm
const mongoSanitize = require('express-mongo-sanitize'); //npm
const xss = require('xss-clean'); //npm
const hpp = require('hpp'); //npm
const cookieParser = require('cookie-parser'); //npm
const cors = require('cors');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const rentRouter = require('./routes/rentRoutes');
const saleRouter = require('./routes/saleRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Implement CORS
// Access-Control-Allow-Origin *
app.use(cors());
app.options('*', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': [
          "'self'",
          'https://cdnjs.cloudflare.com',
          'https://cdn.jsdelivr.net',
          'https://unpkg.com'
        ],
        'default-src': ["'self'", 'ws:', 'wss:'], // Add this line for default sources
        'connect-src': ["'self'", 'ws:', 'wss:'], // Add these lines for WebSocket sources
        'frame-src': ["'self'", 'https://www.google.com'],
        'img-src': [
          "'self'",
          'data:',
          'https://unpkg.com',
          'https://tile.openstreetmap.org',
          'blob:'
        ]
      }
    }
  })
);

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
  max: 70,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please try again later in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against Nosql  query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollutin
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/for_rent', rentRouter);
// app.use('/api/v1/rents', rentRouter);
app.use('/api/v1/for_sale', saleRouter);
// app.use('/api/v1/sales', saleRouter);
app.use('/api/v1/users', userRouter);

// For ALL HTTP methods ERROR
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
