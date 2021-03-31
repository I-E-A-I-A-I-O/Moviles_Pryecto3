import { DBController } from "./databaseController";
import { Mailer } from "./mailer";
import queries from "./queries";
import { TokenController } from "./token";

const dbController = new DBController();
const mailer = new Mailer();
const jwt = new TokenController();

function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

export { dbController, queries, getRandomInt, mailer, jwt };
