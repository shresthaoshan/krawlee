export default {
	CRON_INTERVAL: process.env.CRON_INTERVAL ?? "30 seconds",
	CRON_TIMEZONE: process.env.CRON_TIMEZONE ?? "Asia/Kathmandu",
	DB_URL: process.env.DB_URL ?? null,
};
