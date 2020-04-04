onmessage = (e) => {
	let square = 0;
	let i = 0;
	e.data.forEach((pixel, index) => {
		i++;
		if (i===3) {
			i = 0;
			if (e.data[index-1]!==255 && e.data[index-2]!==255 && e.data[index-3]!==255) square++;
		}
	});
	postMessage(square);
};