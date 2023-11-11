import {Router, NextFunction, Request, Response} from "express";
import session from "express-session";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller";

export const googleRoutes = Router();

const authController = new AuthController();

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
	req.user ? next() : res.sendStatus(401);
}

googleRoutes.use(session({
	secret: "cats",
	resave: true,
	saveUninitialized: true
}));


googleRoutes.use(passport.initialize());
googleRoutes.use(passport.session());



// http://localhost:3004/auth/google -> rota passando pelo gateway
googleRoutes.get("/",
	passport.authenticate("google", { scope: ["email", "profile"]})
);


googleRoutes.get("/callback",
	passport.authenticate("google", {
		successRedirect: "protected",
		failureRedirect: "failure",
	})
);

googleRoutes.get("/failure", (req, res) => {
	res.send("something went wrong...");
});

googleRoutes.get("/protected", isLoggedIn, authController.google);

googleRoutes.get("/logout", (req, res, next) => {
	req.logOut((err) => {
		if(err) {
			return next(err);
		}
	});
	req.session.destroy(() => {console.log("deleted");} );
	res.send("até logo!");
});


