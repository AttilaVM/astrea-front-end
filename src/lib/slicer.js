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

function getCanvasDrawer(canvas, width, height) {
		var ctx = canvas.getContext("2d");
		canvas.width = width;
		canvas.height = height;
		return function canvasDrawer(imgData) {
				ctx.putImageData(imgData, 0, 0);
		};
}
