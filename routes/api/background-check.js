import { calculateDaysBetweenDates } from "../../utils/math.js";
import { auth } from "../../middleware/auth.js";
import express from "express";
import config from "config";
import axios from "axios";

const router = express.Router();

router.post("/", auth, async (req, res) => {
	if (!req.body || !req.body.userId)
		return res
			.status(400)
			.send(
				"Please enter a Roblox User ID into the body of the request."
			);

	const userId = req.body.userId;
	let userInfo;
	try {
		userInfo = await axios.get(
			`https://users.roblox.com/v1/users/${userId}`
		);
	} catch {
		return res.status(400).send("Enter a valid Roblox ID.");
	}

	const creationDate = new Date(userInfo.data.created);
	const accountAge = calculateDaysBetweenDates(creationDate, new Date());
	if (accountAge < config.get("backgroundCheck.minAccountAge"))
		return res.status(400).send("Account not old enough.");

	const groupInfo = await axios.get(
		`https://groups.roblox.com/v2/users/${userId}/groups/roles`
	);
	const groupList = groupInfo.data.data;

	if (groupList.length < config.get("backgroundCheck.minGroups"))
		return res.status(400).send("Account is not in enough groups.");

	const blacklistedGroups = config.get("backgroundCheck.blacklistedGroups");
	for (const group of groupList) {
		const { id, name } = group.group;
		if (blacklistedGroups.includes(id))
			return res
				.status(400)
				.send(`Account is in blacklisted group: ${name}`);
	}

	const hasPublicInventory = await axios.get(
		`https://inventory.roblox.com/v1/users/${userId}/can-view-inventory`
	);
	if (!hasPublicInventory.data.canView)
		return res.status(400).send("Account's inventory is private.");

	const badges = await axios.get(
		`https://www.roblox.com/users/inventory/list-json?assetTypeId=21&itemsPerPage=50&userId=${userId}`
	);
	if (badges.data.Data.Items < config.get("backgroundCheck.minBadges"))
		return res.status(400).send("Account does not have enough badges.");

	// Implement automatic accepting join requests once our bot account is approved

	res.send(
		`Account ${userId} meets all of the requirements and has been accepted into the group!`
	);
});

export default router;
