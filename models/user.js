import mongoose from "mongoose";
import Joi from "joi";

function validateUser(user) {
	const schema = Joi.object({
		robloxId: Joi.number().precision(0).positive().required(),
		username: Joi.string().min(3).max(20).required(),
		rank: Joi.string().required(),
		timezone: Joi.string().min(3).max(4).required(),
		strikes: Joi.number().integer().min(0).max(2).optional().default(0),
		onLOA: Joi.boolean().optional().default(false),
		recentlyPromoted: Joi.boolean().optional().default(false),
		quota: Joi.object({
			phases: Joi.number().integer().optional().default(0),
			tryouts: Joi.number().integer().optional().default(0),
			interviews: Joi.number().integer().optional().default(0),
			activityChecks: Joi.number().integer().optional().default(0),
			other: Joi.number().integer().optional().default(0),
		})
			.optional()
			.default({
				phases: 0,
				tryouts: 0,
				interviews: 0,
				activityChecks: 0,
				other: 0,
			}),
		brigade: Joi.object({
			division: Joi.string().optional().default("N/A"),
			rank: Joi.string().optional().default("N/A"),
			squadrons: Joi.array().items(Joi.string()).optional().default([]),
			subsquadrons: Joi.array()
				.items(Joi.string())
				.optional()
				.default([]),
		})
			.optional()
			.default({
				division: "N/A",
				rank: "N/A",
				squadrons: [],
				subsquadrons: [],
			}),
	});
	return schema.validate(user);
}

const userSchema = new mongoose.Schema({
	robloxId: { type: Number, require: true, unique: true },
	username: {
		type: String,
		require: true,
		unique: true,
		minlength: 3,
		maxlength: 20,
	},
	rank: { type: String, require: true },
	timezone: { type: String, require: true, minlength: 3, maxlength: 4 },
	strikes: { type: Number, default: 0, min: 0, max: 2 },
	onLOA: { type: Boolean, default: false },
	recentlyPromoted: { type: Boolean, default: false },
	quota: {
		phases: { type: Number, default: 0 },
		tryouts: { type: Number, default: 0 },
		interviews: { type: Number, default: 0 },
		activityChecks: { type: Number, default: 0 },
		other: { type: Number, default: 0 },
	},
	brigade: {
		division: { type: String, default: "N/A" },
		rank: { type: String, default: "N/A" },
		squadrons: [String],
		subsquadrons: [String],
	},
});

const User = mongoose.model("User", userSchema);

export { validateUser, User };
