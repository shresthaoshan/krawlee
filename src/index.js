import { Agenda } from "agenda/es.js";

import configs from "./configs/configs.js";
import { runner } from "./runner/main.js";

import * as database from "./loaders/database.js";
await database.connectDatabase();

// scheduler
// const agenda = new Agenda({ db: { address: configs.DB_URL, collection: "schedules" } });

// define jobs
// agenda.define("trigger-scrape", runner);

// setup and initiate the schedule
(async () => {
	await runner();
	// await agenda.start();
	// await agenda.every(configs.CRON_INTERVAL, ["trigger-scrape"], null, { timezone: configs.CRON_TIMEZONE });
	// console.log("Agenda set!!!");
})();

// termination
async function graceful() {
	// await agenda.stop();
	process.exit(0);
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);
