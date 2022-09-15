export const priceToValue = (price = "") => {
	const values = "1234567890";

	return Number(
		price
			.split("")
			.filter((ch) => values.includes(ch))
			.join("")
	);
};
