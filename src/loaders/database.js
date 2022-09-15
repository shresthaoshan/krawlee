import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient();

export const connectDatabase = async () => {
	try {
		await db.$connect();
		console.log("Connection has been established successfully.");
	} catch (ex) {
		console.error("Unable to connect to the database:", error);
		process.exit(1);
	}
};
