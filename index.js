var scene = new THREE.Scene();
scene.background = new THREE.Color(0x72645b);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

controls = new THREE.OrbitControls(camera);
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

// MQTT
var mqttUrl = 'ws://10.30.21.40:8000/mqtt';
var clientId = 'webui_'+Math.random().toString(36).substring(2,15);
console.log('MQTT conenct to', mqttUrl, clientId);
var client = new Paho.MQTT.Client(mqttUrl, clientId);
client.onMessageArrived = function(recv) {
    let topic = recv.destinationName;
    let message = JSON.parse(recv.payloadString);

    console.log(topic, message);

    myrobot.joints.iiwa_joint_1.setAngle(message[0]);
    myrobot.joints.iiwa_joint_2.setAngle(message[1]);
    myrobot.joints.iiwa_joint_3.setAngle(message[2]);
    myrobot.joints.iiwa_joint_4.setAngle(message[3]);
    myrobot.joints.iiwa_joint_5.setAngle(message[4]);
    myrobot.joints.iiwa_joint_6.setAngle(message[5]);
    myrobot.joints.iiwa_joint_7.setAngle(message[6]);
};
client.onConnectionLost = function() {
    console.log('mqtt disconencted');
};
client.connect({onSuccess:function() {
    console.log('mqtt conencted');

    client.subscribe('kuka/status/1/currentJointPosition');
}});
