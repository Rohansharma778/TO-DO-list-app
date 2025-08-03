// backend/routes/auth.js
import express from 'express';
import passport from '../passport.js';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // ✅ Fix: Include user ID in redirect and ensure session is set
    console.log('🔐 Google auth successful, req.user:', req.user);
    console.log('🔐 Session after auth:', req.session);
    
    // Ensure session user is set
    if (req.user) {
      req.session.user = req.user;
      console.log('💾 Session user set:', req.session.user);
    }
    
    if (req.user && req.user._id) {
      // Redirect to /home (not /home/:id since your frontend expects /home)
      res.redirect(`http://localhost:8080/home`);
    } else {
      console.error('❌ No user found after authentication');
      res.redirect('http://localhost:8080/?error=auth_failed');
    }
  }
);

// GET logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Logout failed' 
      });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Session destroy failed' 
        });
      }
      // Clear session cookie
      res.clearCookie('connect.sid');
      
      res.json({ 
        success: true,
        message: 'Logged out successfully',
        redirectUrl: '/' // Add redirectUrl for frontend
      });
    });
  });
});

// POST logout route (this is what your frontend is calling)
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Logout failed' 
      });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ 
          success: false,
          error: 'Session destroy failed' 
        });
      }
      // Clear session cookie
      res.clearCookie('connect.sid');
      
      res.json({ 
        success: true,
        message: 'Logged out successfully',
        redirectUrl: '/' // Add redirectUrl for frontend
      });
    });
  });
});

export default router;