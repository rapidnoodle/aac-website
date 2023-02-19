import backgroundCheck from "./routes/api/background-check.js";
import users from "./routes/api/users.js";
import auth from "./routes/api/auth.js";
import routes from "./routes/routes.js";
import mongoose from "mongoose";
import express from "express";
import helmet from "helmet";
import config from "config";

mongoose
	.connect(config.get("mongoURI"))
	.then(() => console.log("Connected to MongoDB..."))
	.catch((err) => console.warn(err));

const app = express();

app.use(express.json());
app.use(helmet());
app.use("/api/users", users);
app.use("/api/background-check", backgroundCheck);
app.use("/api/auth", auth);
app.use("/", routes);

const port = config.get("port") || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
