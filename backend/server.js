import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import router from './routes/routes.js';
import passport from './passport.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import authRoutes from './routes/auth.js';

dotenv.config();
connectDB();

const app = express();

// ✅ CRITICAL: CORS must be configured BEFORE session middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', 'true'); // ✅ This is crucial!
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// ✅ FIXED: Session configuration with proper cookie settings
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // ✅ Custom session name
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 3600,
    ttl: 24 * 60 * 60 // 24 hours TTL
  }),
  cookie: {
    secure: false,          // ✅ false for localhost
    httpOnly: false,        // ✅ CHANGED: Allow JS access for debugging
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',        // ✅ Important for cross-origin
    domain: 'localhost'     // ✅ Explicit domain
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Session debugging middleware
app.use((req, res, next) => {
  console.log('\n🍪 Cookie Debug:', {
    cookies: req.headers.cookie || 'No cookies',
    sessionID: req.sessionID,
    sessionExists: !!req.session,
    sessionKeys: req.session ? Object.keys(req.session) : [],
    passportInSession: !!(req.session && req.session.passport)
  });
  next();
});

// ✅ Improved middleware to sync req.user and req.session.user
app.use((req, res, next) => {
  if (req.user && !req.session.user) {
    req.session.user = req.user;
    console.log('🔄 Synced session user from passport:', req.session.user._id);
  }
  else if (!req.user && req.session.user) {
    console.log('⚠️  Session user exists but passport user doesn\'t:', req.session.user._id);
  }
  next();
});

// ✅ Enhanced debugging middleware
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.path}`);
  console.log('🔍 Auth Status:', {
    sessionID: req.sessionID?.slice(-6) || 'none',
    passportUser: req.user ? req.user._id : 'none',
    sessionUser: req.session.user ? req.session.user._id : 'none',
    isAuthenticated: req.isAuthenticated()
  });
  next();
});

// ✅ Cookie test endpoint
app.get('/api/test-cookie', (req, res) => {
  console.log('🧪 Cookie test:', {
    sessionID: req.sessionID,
    cookies: req.headers.cookie,
    session: req.session
  });
  
  // Set a test value in session
  req.session.testValue = 'Hello from session!';
  
  res.json({
    message: 'Cookie test',
    sessionID: req.sessionID,
    testValue: req.session.testValue,
    cookies: req.headers.cookie
  });
});

app.use('/', router);
app.use('/auth', authRoutes);

const port = process.env.PORT || 5005;
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📍 Frontend expected at: http://localhost:8080`);
  console.log(`🔗 Auth callback: http://localhost:${port}/auth/google/callback`);
});