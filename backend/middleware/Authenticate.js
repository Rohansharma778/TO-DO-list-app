// backend/middleware/auth.js

export function ensureAuth(req, res, next) {
  console.log('🔐 ensureAuth middleware check:', {
    isAuthenticated: req.isAuthenticated(),
    hasUser: !!req.user,
    hasSessionUser: !!req.session.user,
    userID: req.user ? req.user._id : 'none',
    sessionUserID: req.session.user ? req.session.user._id : 'none',
    sessionID: req.sessionID?.slice(-6) || 'none'
  });

  // Primary check: Passport authentication
  if (req.isAuthenticated() && req.user) {
    console.log('✅ Authentication successful via passport');
    return next();
  }
  
  // Secondary check: Session user (for page refreshes)
  if (req.session && req.session.user) {
    console.log('✅ Authentication successful via session user');
    // Restore req.user from session if it's missing
    if (!req.user) {
      req.user = req.session.user;
      console.log('🔄 Restored req.user from session');
    }
    return next();
  }

  // Check if session exists but user data is missing
  if (req.session && req.sessionID) {
    console.log('⚠️  Session exists but no user data found');
    console.log('Session data:', {
      sessionID: req.sessionID,
      sessionKeys: Object.keys(req.session),
      passport: req.session.passport
    });
  }

  console.log('❌ Authentication failed - redirecting to login');
  return res.status(401).json({ 
    message: 'Not authorized',
    error: 'Please log in to access this resource',
    debug: {
      isAuthenticated: req.isAuthenticated(),
      hasUser: !!req.user,
      hasSession: !!req.session,
      hasSessionUser: !!(req.session && req.session.user),
      sessionID: req.sessionID ? 'exists' : 'missing'
    }
  });
}

// Alternative middleware that's more permissive (for testing)
export function ensureAuthLenient(req, res, next) {
  console.log('🔐 ensureAuthLenient check:', {
    isAuthenticated: req.isAuthenticated(),
    hasUser: !!req.user,
    hasSessionUser: !!req.session?.user,
    hasSessionPassport: !!req.session?.passport
  });

  // Check multiple authentication sources
  const isLoggedIn = req.isAuthenticated() || 
                    req.user || 
                    req.session?.user || 
                    req.session?.passport?.user;

  if (isLoggedIn) {
    console.log('✅ Authentication successful (lenient check)');
    return next();
  }
  
  console.log('❌ Authentication failed (lenient check)');
  return res.status(401).json({ 
    message: 'Not authorized',
    suggestion: 'Please log in again'
  });
}