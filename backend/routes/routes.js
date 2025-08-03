import express from 'express'
import Task from '../model/task.js'
import { ensureAuth } from '../middleware/Authenticate.js';
import { Add, Edit, Home, SignUp, taskDetail, removetask,getCurrentUser } from '../controller/controller.js';

const router = express.Router();

// Auth routes
router.get('/', SignUp);

// API routes (what your frontend is using)
router.get('/api/tasks', ensureAuth, Home);

router.post('/api/tasks', ensureAuth, (req, res, next) => {
  console.log('🎯 POST /api/tasks route hit');
  console.log('📋 Request body:', req.body);
  next();
}, Add);

// Update route (PUT request for editing tasks)
router.put('/api/tasks/:id', ensureAuth, (req, res, next) => {
  console.log('🎯 PUT /api/tasks/:id route hit - ID:', req.params.id);
  console.log('📋 Request body:', req.body);
  next();
}, Edit);

// Delete route (DELETE request for removing tasks)
router.delete('/api/tasks/:id', ensureAuth, (req, res, next) => {
  console.log('🎯 DELETE /api/tasks/:id route hit - ID:', req.params.id);
  next();
}, removetask);

// Page routes (for redirects - these might not be needed if you're using React routing)
router.get('/home', ensureAuth, Home);
router.get('/home/:id', ensureAuth, Home);
router.get('/task/:id', ensureAuth, taskDetail);

router.get('/api/user',ensureAuth, getCurrentUser);





//####debug#####
// Add this route to your routes.js file for testing

router.get('/api/debug/full-session', (req, res) => {
  console.log('🧪 Full session debug:', {
    sessionID: req.sessionID,
    session: req.session,
    cookies: req.headers.cookie,
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
    sessionUser: req.session?.user
  });
  
  res.json({
    sessionID: req.sessionID,
    sessionData: req.session,
    cookies: req.headers.cookie,
    isAuthenticated: req.isAuthenticated(),
    passportUser: req.user ? {
      id: req.user._id,
      displayName: req.user.displayName
    } : null,
    sessionUser: req.session?.user ? {
      id: req.session.user._id,
      displayName: req.session.user.displayName
    } : null,
    allSessionKeys: req.session ? Object.keys(req.session) : []
  });
});

// Test route to manually set session data
router.get('/api/debug/set-test-session', (req, res) => {
  req.session.testData = {
    timestamp: new Date().toISOString(),
    message: 'Test session data'
  };
  
  res.json({
    message: 'Test session data set',
    sessionID: req.sessionID,
    testData: req.session.testData
  });
});
export default router;