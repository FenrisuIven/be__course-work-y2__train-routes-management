import express, {json} from 'express';
import cors from "cors";
const app = express();

import router from "./src/controllers/router";
import {repositories} from "./src/repositories";
import prismaClient from "./src/setup/orm/prisma";

app.use(cors());
app.use(json());
app.use(router)

app.listen(3000, () => console.log("Server is listening on: http:\\\\localhost:3000"));
