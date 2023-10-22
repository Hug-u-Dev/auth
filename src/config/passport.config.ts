import {Request} from "express";
import passport from "passport";
import {Strategy, Profile, VerifyCallback } from "passport-google-oauth20";

import { AuthService } from "../services/auth.service";


const authService = new AuthService();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "940240294055-mrhlum7gnbmtqnkchsus5349veiinkp7.apps.googleusercontent.com"; //colocar no .env
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ||"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";

const GOOGLE_BASE_URL =  process.env.GOOGLE_BASE_URL ||"http://localhost:3004/auth/google";

passport.use(new Strategy(
	{
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: `${GOOGLE_BASE_URL}/callback`,
		passReqToCallback: true
	},
	async (request: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
		await authService.google(profile);
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