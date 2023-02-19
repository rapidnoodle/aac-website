function calculateDaysBetweenDates(date1, date2) {
	const oneDay = 24 * 60 * 60 * 1000;
	const date1InMillis = date1.getTime();
	const date2InMillis = date2.getTime();
	const days = Math.round(Math.abs(date2InMillis - date1InMillis) / oneDay);
	return days;
}

export { calculateDaysBetweenDates };
