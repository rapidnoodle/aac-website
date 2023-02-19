import jwt from "jsonwebtoken";
import express from "express";
import config from "config";

const router = express.Router();

router.post("/", (req, res) => {
	if (!req.body || !req.body.key)
		return res
			.status(400)
			.send("Please enter a key into the body of the request.");

	const key = req.body.key;
	const permissions = {
		canView: key === config.get("officerKey"),
		canEdit: key === config.get("hicomKey"),
	};
	if (permissions.canEdit) permissions.canView = true;
	if (!permissions.canView) res.status(400).send("Invalid key.");

	const token = jwt.sign(permissions, config.get("jwtPrivateKey"));
	res.header("x-auth-token", token).send(permissions);
});

export default router;
