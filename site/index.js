function getMockData() {
		return {sliceYScale: 256,
						mockImgStack: document.getElementById("mock-img-stack")};
}

function isInteger(n) {
		if (n == Math.round(n)) {
				console.log(n);
		}
		// console.log(n);
}

function isNewRow(n, width) {
		isInteger(n / width);
}

function getImageData(img) {
		var canvas = document.createElement("canvas");
		var ctx = canvas.getContext("2d");
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);
		return ctx.getImageData(0, 0, img.width, img.height);
}

function getCanvasDrawer(canvas, width, height) {
		var ctx = canvas.getContext("2d");
		canvas.width = width;
		canvas.height = height;
		return function canvasDrawer(imgData) {
				ctx.putImageData(imgData, 0, 0);
		};
}

function slicer(imgData, sliceYScale, sliceNum) {
		var rgbaArr = imgData.data;
		var xScale = imgData.width;
		var row = 0;
		var slice = 0;

		var voxelStart = 0;
		while(voxelStart < rgbaArr.length) {
				isInteger(voxelStart);
				voxelStart += 4;

		}

}

function main() {
		const data = getMockData();
		var canvas = document.createElement("canvas");
		var canvasContainer = document.getElementById("canvas_container");
		canvasContainer.appendChild(canvas);
		var drawer = getCanvasDrawer(canvas, 256, 256);

		var imgData = getImageData(data.mockImgStack);
		console.log(imgData.data.length);

		drawer(imgData);

		slicer(imgData, 256, 10);
}

// Renderer
