import { createPuppeteerRouter, Dataset } from "crawlee";

export const router = createPuppeteerRouter();

router.addDefaultHandler(({ log }) => {
	log.info("Route Dispatched...");
});

router.addHandler("SCRAPE", async ({ request, page }) => {
	const {
		id,
		loadedUrl: productUrl,
		userData: {
			product: { sku },
		},
	} = request;

	const productName = await page.$$eval("span.pdp-mod-product-badge-title", (els) => els[0].textContent);

	const priceContainer = await page.$(".pdp-product-price");

	const listedPrice = await priceContainer.$$eval("span.pdp-price_type_deleted", (els) => els[0]?.textContent || "");
	const sellingPrice = await priceContainer.$$eval("span.pdp-price_type_normal", (els) => els[0]?.textContent || "");
	const discount = await priceContainer.$$eval("span.pdp-product-price__discount", (els) => els[0]?.textContent || "");

	await Dataset.pushData({
		id,
		sku,
		productName,
		productUrl,
		listedPrice,
		sellingPrice,
		discount,
	});
});
