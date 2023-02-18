import config from "config";
import axios from "axios";

async function getHighRankRoleIds(roleNames) {
	const groupRoles = await axios.get(
		`https://groups.roblox.com/v1/groups/${config.get("groupId")}/roles`
	);
	const roleIds = groupRoles.data.roles
		.filter((role) => roleNames.includes(role.name))
		.map((role) => ({ name: role.name, id: role.id }));
	return roleIds;
}

async function getUsersByRoles(roles) {
	const users = [];
	for (const role of roles) {
		const data = await axios.get(
			`https://groups.roblox.com/v1/groups/${config.get(
				"groupId"
			)}/roles/${role.id}/users`
		);
		const currentUsers = data.data.data.map((user) => {
			const newUser = { ...user };
			newUser.rank = role.name;
			delete newUser.hasVerifiedBadge;
			delete newUser.displayName;
			return newUser;
		});
		users.push(...currentUsers);
	}
	return users;
}

export { getHighRankRoleIds, getUsersByRoles };
