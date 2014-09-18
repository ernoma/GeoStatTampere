
// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// var renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColorHex( 0xffffff, 1 )
// document.body.appendChild(renderer.domElement);

// var geometry = new THREE.BoxGeometry(1,1,1);
// var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// camera.position.z = 5;

// var render = function () {
	// requestAnimationFrame(render);

	// cube.rotation.x += 0.1;
	// cube.rotation.y += 0.1;

	// renderer.render(scene, camera);
// };

// render();

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, -50, 50);
//camera.position.z = 5;

var controls = new THREE.TrackballControls(camera);

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setClearColorHex( 0xffffff, 1 )
document.getElementById('webgl').appendChild( renderer.domElement );

var terrainLoader = new THREE.TerrainLoader();
terrainLoader.load('data/tampere.bin', function(data) {
	console.log(data);
	
	var geometry = new THREE.PlaneGeometry(120, Math.floor(120 * (267 / 399)), 399, 267);
  
	console.log(geometry.vertices.length);
  
	for (var i = 0, l = geometry.vertices.length; i < l; i++) {
		geometry.vertices[i].z = data[i] / 65535 * 5;
	}
	
	console.log("done modifying z");
	
	var material = new THREE.MeshPhongMaterial({
		map: THREE.ImageUtils.loadTexture('images/tampere_terrain.png')
		//color: 0xdddddd, 
		//wireframe: true
	});
	
	var plane = new THREE.Mesh(geometry, material);
	scene.add(plane);
	
	scene.add(new THREE.AmbientLight(0xeeeeee));
});

function render() {
	controls.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

render();
