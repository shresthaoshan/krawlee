import { db } from "../loaders/database.js";

// create
const createReport = async (
	sku = "",
	productName = "",
	productUrl = "",
	listedPrice = 0,
	listedChanged = false,
	sellingPrice = 0,
	sellingChanged = false
) => {
	const doc = await db.productReport.create({
		data: {
			sku,
			productName,
			productUrl,
			listedPrice,
			sellingPrice,
			listedChanged,
			sellingChanged,
		},
	});
	return doc.id;
};
const createManyReports = async (details = []) => {
	const ids = [];
	for (let detail of details) {
		try {
			// console.log(detail);
			const {
				sku,
				productName,
				productUrl,
				currentListedPrice: listedPrice,
				changeInListed: listedChanged,
				currentSellingPrice: sellingPrice,
				changeInSelling: sellingChanged,
			} = detail;
			const { id } = await createReport(sku, productName, productUrl, listedPrice, listedChanged, sellingPrice, sellingChanged);
			ids.push(id);
		} catch (ex) {
			continue;
		}
	}
	return ids;
};

// read
const findByID = async (id = "") => {
	return await db.productReport.findUnique(id);
};
const findLatestByProductSKU = async (sku = "") => {
	// return only latest record
	return await db.productReport.findFirst({ where: { sku }, orderBy: { dateTime: "desc" } });
};
const findAllByProductSKU = async (sku = "") => {
	return await db.productReport.findMany({ where: { sku }, orderBy: { dateTime: "desc" } });
};
const findLatestSellingChanged = async (sku = "") => {
	return await db.productReport.findFirst({ where: { sku, sellingChanged: true }, orderBy: { dateTime: "desc" } });
};
const findLatestListedChanged = async (sku = "") => {
	return await db.productReport.findFirst({ where: { sku, listedChanged: true }, orderBy: { dateTime: "desc" } });
};

export default {
	createReport,
	createManyReports,
	findByID,
	findLatestByProductSKU,
	findAllByProductSKU,
	findLatestSellingChanged,
	findLatestListedChanged,
};
