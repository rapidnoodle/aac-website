import jwt from "jsonwebtoken";
import config from "config";

function auth(req, res, next) {
	const token = req.header("x-auth-token");
	if (!token)
		return res.status(401).send("Access denied, no token provided.");

	try {
		const permissions = jwt.verify(token, config.get("jwtPrivateKey"));
		req.permissions = permissions;
		next();
	} catch {
		res.status(401).send("Invalid token.");
	}
}

function hasEdit(req, res, next) {
	if (!req.permissions.canEdit)
		return res
			.status(403)
			.send("You do not have permission to edit the database.");
	next();
}

export { auth, hasEdit };
