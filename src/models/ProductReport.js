import { db } from "../loaders/database.js";

export const reports = db.collection("product_reports");

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
	const newDoc = await reports.insertOne({
		sku,
		productName,
		productUrl,
		listedPrice,
		sellingPrice,
		listedChanged,
		sellingChanged,
		dateTime: Date.now(),
	});
	return newDoc.insertedId;
};
const createManyReports = async (details = []) => {
	const dateTime = Date.now();
	const newDocs = await reports.insertMany(
		details.map((item) => ({
			sku: item.sku,
			productName: item.productName,
			productUrl: item.productUrl,
			listedPrice: item.listedPrice || item.currentListedPrice,
			sellingPrice: item.sellingPrice || item.currentSellingPrice,
			listedChanged: item.changeInListed,
			sellingChanged: item.changeInListed,
			dateTime,
		}))
	);
	return newDocs.insertedIds;
};

// read
const findByID = async (id = "") => {
	return await reports.findOne({ _id: id });
};
const findLatestByProductSKU = async (sku = "") => {
	return (await reports.find({ product_sku: sku }, { sort: { dateTime: -1 }, limit: 1 }).toArray()?.[0]) || null;
};
const findAllByProductSKU = async (sku = "") => {
	return await reports.find({ product_sku: sku }).toArray();
};
const findLatestSellingChanged = async (sku = "") => {
	return (await reports.find({ product_sku: sku, sellingChanged: true }, { sort: { dateTime: -1 }, limit: 1 }).toArray()?.[0]) || null;
};
const findLatestListedChanged = async (sku = "") => {
	return (await reports.find({ product_sku: sku, listedChanged: true }, { sort: { dateTime: -1 }, limit: 1 }).toArray()?.[0]) || null;
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
