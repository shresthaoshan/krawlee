import { MongoClient } from "mongodb";
import configs from "../configs/configs.js";

const url = configs.DB_URL;
const client = new MongoClient(url);

export const connectDatabase = async () => {
	await client.connect();
	console.log("Connected successfully to server");
};

export const db = client.db();
