// backend/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from './model/user.js';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5005/auth/google/callback', // ✅ Correct port 5005
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('🔐 Google profile:', profile);

      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        image: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          console.log('✅ Existing user found:', user);
          return done(null, user);
        }
        
        user = await User.create(newUser);
        console.log('✅ New user created:', user);
        return done(null, user);
      } catch (err) {
        console.error('❌ Passport strategy error:', err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('📝 Serializing user:', user._id);
  done(null, user._id); // ✅ Use _id instead of id
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('🔍 Deserializing user ID:', id);
    const user = await User.findById(id);
    console.log('✅ User deserialized:', user);
    done(null, user);
  } catch (err) {
    console.error('❌ Deserialize error:', err);
    done(err, null);
  }
});

export default passport;