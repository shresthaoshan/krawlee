import fs from "fs";
import path from "path";

import googleSheets from "@googleapis/sheets";

const getSheetHandler = async () => {
	const credential_content = fs.readFileSync(path.resolve("credentials.json"), { encoding: "utf-8" }).toString("hex");
	const credentials = JSON.parse(credential_content);

	const auth = await googleSheets.auth.getClient({
		scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
		credentials,
	});
	return googleSheets.sheets({ version: "v4", auth });
};

const mapRowsToObjects = (headers = [], records = []) => {
	return records.map((rec) => {
		let __rec = {};
		for (let idx in headers) {
			const index = Number(idx);
			__rec[headers[index]] = rec[index];
		}
		return __rec;
	});
};

export const fetchInputRecords = async (sheet_id = "") => {
	try {
		const sheets = await getSheetHandler();

		const response = await sheets.spreadsheets.values.get({ spreadsheetId: sheet_id, range: "Sheet1!A1:Z" });

		const [headers, ...records] = response.data.values;

		return mapRowsToObjects(headers, records);
	} catch (ex) {
		// console.error(ex.message);
		console.log({ ex });

		return [];
	}
};
