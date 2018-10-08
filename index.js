var scene = new THREE.Scene();
scene.background = new THREE.Color(0x72645b);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

controls = new THREE.OrbitControls(camera);
controls.target.set(0, -0.2, -0.2);
controls.update();

var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(light);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var loader = new THREE.STLLoader();
var material = new THREE.MeshPhongMaterial({color: 0xAAAAAA, specular: 0x111111, shininess: 200});

loader.load('robo.stl', function(geometry) {
    var mesh = new THREE.Mesh(geometry, material);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();