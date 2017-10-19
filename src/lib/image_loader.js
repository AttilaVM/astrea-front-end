function getMockData() {
		return {sliceYScale: 256,
						mockImgStack: document.getElementById("mock-img-stack")};
}

function getImageData(img) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
		return ctx.getImageData(0, 0, img.width, img.height);
}

export function loadImage(imageId) {
		const data = getMockData();
		return getImageData(data.mockImgStack);
}
