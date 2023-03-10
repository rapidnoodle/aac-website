import { getHighRankRoleIds, getUsersByRoles } from "../../utils/roblox.js";
import { validateUser, User } from "../../models/user.js";
import { auth, hasEdit } from "../../middleware/auth.js";
import express from "express";
import config from "config";

const router = express.Router();

router.get("/", auth, async (req, res) => {
	const users = await User.find();
	res.send(users);
});

router.get("/:id", auth, async (req, res) => {
	const user = await User.findOne({ robloxId: parseInt(req.params.id) });
	if (!user)
		return res
			.status(404)
			.send(`The Roblox ID '${req.params.id}' does not exist.`);
	res.send(user);
});

router.put("/", [auth, hasEdit], async (req, res) => {
	const highRankRoleIds = await getHighRankRoleIds(
		config.get("highRankRoles")
	);
	const highRankUsers = await getUsersByRoles(highRankRoleIds);

	for (const user of highRankUsers) {
		let userFound = await User.findOne({ robloxId: user.userId });
		if (!userFound)
			userFound = new User({
				robloxId: user.userId,
				username: user.username,
				rank: user.rank,
			});
		else
			userFound.set({
				username: user.username,
				rank: user.rank,
			});

		await userFound.save();
	}

	const users = await User.find();
	for (const user of users)
		if (!highRankUsers.find((hr) => hr.userId === user.robloxId))
			user.delete();

	res.send("Database successfully synced with Roblox!");
});

router.put("/:id", [auth, hasEdit], async (req, res) => {
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

router.delete("/quota", [auth, hasEdit], async (req, res) => {
	const users = await User.find();
	for (const user of users) {
		user.set({
			recentlyPromoted: false,
			quota: {
				phases: 0,
				tryouts: 0,
				interviews: 0,
				activityChecks: 0,
				other: 0,
			},
		});
		user.save();
	}
	res.send("The quota has been successfully reset!");
});

export default router;
