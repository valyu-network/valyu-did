import { createUserDID } from "./controllers/userController.js";
import { createDataDID } from "./controllers/dataController.js";
import { resolveDID } from "./controllers/resolverController.js";
import express from "express";
import bodyParser from 'body-parser';

// Load environment variables
import { config } from 'dotenv';
config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.post("/createUserDID", createUserDID);
app.post("/createDataDID", createDataDID);
app.post("/resolveDID", resolveDID);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


