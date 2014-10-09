
var opts = {
  lines: 13, // The number of lines to draw
  length: 10, // The length of each line
  width: 5, // The line thickness
  radius: 15, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '0%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};
var target = document.getElementById('spinner');
var spinner = new Spinner(opts).spin(target);

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
	
	var $loading = $('#loading').hide();
});

function render() {
	controls.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

render();
