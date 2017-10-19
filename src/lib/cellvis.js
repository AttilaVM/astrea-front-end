const THREE = require("three");
// Performance monitioring
const Stats = require("stats-js");

function voxelWalker(voxelData, size, geometry) {
    [x_size, y_size, z_size] = size;
    for (var x = 0; x < x_size; x++) {
	for (var y = 0; y < y_size; y++) {
	    for (var z = 0; z < z_size; z++) {
		let pos = z * z_size * y_size + y * x_size + x;
		let vertex = new THREE.Vector3(x, y, z);
		geometry.push(vertex);
	    }
	}
    }
    return geometry;
};

export function initCellvis(containerElem, voxelData, voxelDimensions, metaData) {
    let canvasWidth = containerElem.offsetWidth;
    let canvasHeight = containerElem.offsetHeight;
    // Basic scene setup
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasWidth, canvasHeight);
    /// Adapt to displays with different pixel densities
    renderer.setPixelRatio(devicePixelRatio);
    /// Append canvas, gui and performance monitior
    containerElem.appendChild(renderer.domElement);
    const stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = "0px";
    containerElem.appendChild(stats.domElement);
    const camera =
	  new THREE.PerspectiveCamera( 75
				     , canvasWidth / canvasHeight
				     , 0.1
				     , 1000);
    camera.name = "p-camera";
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 10;
    // Stack setup
    const stackGeometry =
	  new THREE.Geometry();
	voxelWalker(voxelData, voxelDimensions, stackGeometry);
    const particleMaterial =
	  new THREE.ParticleBasicMaterial({ color: 0xafaf00
					  , size: 3
					  });
    const particleSystem =
	  new THREE.ParticleSystem(stackGeometry, particleMaterial);
    // Populate Scene
    scene.add(particleSystem);
    scene.add(camera);



    function render() {
	renderer.render(scene, camera);
    }

    function animate() {
	requestAnimationFrame(animate);
	render();
    }

    animate();
}
