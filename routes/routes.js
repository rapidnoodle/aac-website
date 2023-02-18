import express from "express";
import config from "config";

const router = express.Router();

router.get("/", (req, res) => {
	res.send(config.get("welcomeMessage"));
});

export default router;
