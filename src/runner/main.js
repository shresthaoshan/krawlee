import { PuppeteerCrawler, KeyValueStore, Dataset } from "crawlee";
import { priceToValue } from "../utils/prices.js";
import { router } from "./routes.js";

import ProductReport from "../models/ProductReport.js";

const crawler = new PuppeteerCrawler({ requestHandler: router });

export const runner = async () => {
	// fetch input from sheets
	const input__products = await KeyValueStore.getInput();

	// scrape
	await crawler.run(
		input__products.map((product) => ({
			url: product.url,
			label: "SCRAPE",
			userData: { product },
		}))
	);

	// post-processing
	const dataset = await Dataset.open();
	const items = (await dataset.getData()).items.map((item) => ({
		...item,
		listedPrice: priceToValue(item.listedPrice),
		sellingPrice: priceToValue(item.sellingPrice),
	}));

	const reports = [];
	for (const item of items) {
		const { listedPrice: currentListed, sellingPrice: currentSelling, sku } = item;

		// fetch last saved product record
		const prevDoc = await ProductReport.findLatestByProductSKU(sku);

		let currentListedPrice = currentListed,
			pastListedPrice = 0,
			changeInListed = false,
			listingLastChanged = "never";
		let currentSellingPrice = currentSelling,
			pastSellingPrice = 0,
			changeInSelling = false,
			sellingLastChanged = "never";

		// evaluate the changes to prices
		if (prevDoc) {
			pastListedPrice = prevDoc.listedPrice;
			changeInListed = prevDoc.listedPrice == currentListed;
			pastSellingPrice = prevDoc.sellingPrice;
			changeInSelling = prevDoc.sellingPrice == currentSelling;

			if (changeInListed) listingLastChanged = Date.now();
			else {
				listingLastChanged = (await ProductReport.findLatestListedChanged(sku)).dateTime || "never";
			}

			if (changeInSelling) sellingLastChanged = Date.now();
			else {
				sellingLastChanged = (await ProductReport.findLatestSellingChanged(sku))?.dateTime || "never";
			}
		}

		//
		reports.push({
			sku,
			productName: item.productName,
			productUrl: item.productUrl,
			currentListedPrice,
			pastListedPrice,
			changeInListed,
			listingLastChanged,
			currentSellingPrice,
			pastSellingPrice,
			changeInSelling,
			sellingLastChanged,
		});
	}

	// here: do smth with reports (maybe mail, generate sheets, ...)
	await ProductReport.createManyReports(reports);

	console.log("Pass Complete!!");
};
