import { DBController } from './databaseController';
import {Mailer} from './mailer';
import queries from './queries';

const dbController = new DBController();
const mailer = new Mailer();

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

export {
    dbController,
    queries,
    getRandomInt,
    mailer
}