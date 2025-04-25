import { Sequelize, Options } from "sequelize";

import * as creds from "../credentials/dbCredentials.json";

const sequelize = new Sequelize(creds.database, creds.username, creds.password, {
  host: "localhost",
  dialect: "postgres",
});

export default sequelize;