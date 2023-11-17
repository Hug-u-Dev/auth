import {Request} from "express";
import passport from "passport";
import {Strategy, Profile, VerifyCallback } from "passport-google-oauth20";


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "159068667512-66958at96j0c63hp8ieptqghnlgkfgmv.apps.googleusercontent.com"; //colocar no .env
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ||"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";

//endpoint to login/register google
const GOOGLE_BASE_URL =  process.env.GOOGLE_BASE_URL ||"http://localhost:3004/google";

passport.use(new Strategy(
	{
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: `${GOOGLE_BASE_URL}/callback`,
		passReqToCallback: true
	},
	async (request: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
		// await authService.google(profile);
		return done(null, profile);
	})
);


passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user: any, done) {
	done(null, user);
});


export default passport;