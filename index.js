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

const manager = new THREE.LoadingManager();
const loader = new URDFLoader(manager);
const material = new THREE.MeshPhongMaterial({color: 0xAAAAAA, specular: 0x111111, shininess: 200});
var geometryLoader = new THREE.STLLoader();
var myrobot = null;

loader.load('urdf/iiwa7/urdf/iiwa7.urdf', {}, robot => {
    myrobot = robot;
    console.log('complete', robot);

    scene.add(robot);
}, { loadMeshCb: (path, ext, done) => {
    geometryLoader.load(path, geometry => {
        console.log(path);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        done(mesh);
    });
}});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
