import { validateUser, User } from "../../models/user.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
	const users = await User.find();
	res.send(users);
});

router.get("/:id", async (req, res) => {
	const user = await User.findOne({ robloxId: parseInt(req.params.id) });
	if (!user)
		return res
			.status(404)
			.send(`The Roblox ID '${req.params.id}' does not exist.`);
	res.send(user);
});

router.post("/", async (req, res) => {
	const user = await User.findOne({ robloxId: parseInt(req.body.robloxId) });
	if (user)
		return res
			.status(404)
			.send(`User '${req.body.robloxId}' is already added.`);

	const { error, value } = validateUser(req.body);
	if (error) return res.status(400).send(error);

	const newUser = new User(value);
	res.send(await newUser.save());
});

router.put("/:id", async (req, res) => {
	const { error, value } = validateUser(req.body);
	if (error) return res.status(400).send(error);

	const user = await User.findOne({ robloxId: parseInt(req.params.id) });
	if (!user)
		return res
			.status(404)
			.send(`The Roblox ID '${req.params.id}' does not exist.`);
	if (value.robloxId != req.params.id)
		return res.status(400).send("The Roblox IDs must match.");

	user.set(value);
	res.send(await user.save());
});

router.delete("/:id", async (req, res) => {
	const user = await User.findOne({ robloxId: parseInt(req.params.id) });
	if (!user)
		return res
			.status(404)
			.send(`The Roblox ID '${req.params.id}' does not exist.`);

	user.delete();
	res.send(user);
});

export default router;
