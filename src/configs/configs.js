import * as dotenv from "dotenv";
dotenv.config();

const configs = {
	CRON_INTERVAL: process.env.CRON_INTERVAL ?? "30 seconds",
	CRON_TIMEZONE: process.env.CRON_TIMEZONE ?? "Asia/Kathmandu",
	INPUT_GOOGLE_SHEET_ID: process.env.INPUT_GOOGLE_SHEET_ID || "",
};

export default configs;
