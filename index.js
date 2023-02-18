import dotenv from "dotenv";
dotenv.config();

import users from "./routes/api/users.js";
import routes from "./routes/routes.js";
import mongoose from "mongoose";
import express from "express";
import helmet from "helmet";

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("Connected to MongoDB..."))
	.catch((err) => console.warn(err));

const app = express();

app.use(express.json());
app.use(helmet());
app.use("/api/users", users);
app.use("/", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
