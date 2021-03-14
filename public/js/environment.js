/*
 * Special thanks to Vibert Thio and Alvaro Lacouture for portions of this code, especially lighting references
 */

let myMesh;
let moon;
let water;
let glow;
let radiating;
let glowValue;
let time;
let d;


/*'use strict';

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
startButton.onclick = start;
stopButton.onclick = stop;

const instantMeter = document.querySelector('#instant meter');
const slowMeter = document.querySelector('#slow meter');
const clipMeter = document.querySelector('#clip meter');

const instantValueDisplay = document.querySelector('#instant .value');
const slowValueDisplay = document.querySelector('#slow .value');
const clipValueDisplay = document.querySelector('#clip .value');

// Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
	audio: true,
	video: true
};

let meterRefresh = null;
*/

function createEnvironment(scene) {
	console.log("Adding environment");

	addWater(scene);

	THREE.RectAreaLightUniformsLib.init();
	rectLights = createLights()
	rectLights.forEach(light => scene.add(light))

	glorb(scene);

	//Create moon
	let moonGeometry = new THREE.SphereGeometry(3, 12, 12);
	let moontexture = new THREE.TextureLoader().load("../assets/textures/moon.jpg");
	let moonMaterial = new THREE.MeshBasicMaterial({ map: moontexture });
	moon = new THREE.Mesh(moonGeometry, moonMaterial);
	moon.position.set(20, 13, 5);
	scene.add(moon);
}

function updateEnvironment(scene) {
  // myMesh.position.x += 0.01;
	water.material.uniforms['time'].value += 1.0 / 60.0;
	radiate(5);
	//console.log(instantValueDisplay.innerText);

}

function glorb(scene) {
	//Create glowing orb
	const sphere = new THREE.SphereGeometry(0.5, 16, 8);

	var customMaterial = new THREE.ShaderMaterial(
		{
			uniforms:
			{
				"c": { type: "f", value: 1.0 },
				"p": { type: "f", value: 1.4 },
				glowColor: { type: "c", value: new THREE.Color(0xffff00) },
				viewVector: { type: "v3", value: new THREE.Vector3() }
			},
			vertexShader: document.getElementById('vertexShader').textContent,
			fragmentShader: document.getElementById('fragmentShader').textContent,
			side: THREE.FrontSide,
			blending: THREE.AdditiveBlending,
			transparent: true
		});
	
	glow = new THREE.Mesh(sphere.clone(), customMaterial.clone());
	scene.add(glow);

}


function radiate(radiating) {
	const time = Date.now() * 0.0025;
	const d = radiating;
	const growth = Math.abs(Math.sin(time * 0.1) * d);

	glow.position.y = 1.5;
	glow.scale.set(growth, growth, growth);

}


function createRectangularLight(color, intensity, width, height, position, lookAt) {
	rectLight = new THREE.RectAreaLight(color, intensity, width, height);
	rectLight.position.set(...position);
	rectLight.lookAt(...lookAt);
	// scene.add( rectLight );

	var rectLightMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ side: THREE.BackSide }));
	rectLightMesh.scale.x = rectLight.width;
	rectLightMesh.scale.y = rectLight.height;
	rectLight.add(rectLightMesh);

	var rectLightMeshBack = new THREE.Mesh(new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial({ color: 0x080808 }));
	rectLightMesh.add(rectLightMeshBack);
	return rectLight
}

function createLights() {
	const CIRCLE_PERCENTAGE = 0.7
	const offsetAngle = Math.PI * -1
	const number = 15
	const deltaAngle = 2 * Math.PI * CIRCLE_PERCENTAGE / number
	const radius = 30

	const lights = []

	for (let i = 0; i < number; i++) {

		const a = i * deltaAngle + offsetAngle
		const h = 5
		const w = 1
		const x = radius * Math.cos(a)
		const z = radius * Math.sin(a)
		const y = h * 0.5 + 0.5

		lights[i] = createRectangularLight(0xff0000, 0, w, h, [x, y, z], [0, y, 0])

	}

	return lights

}

function addWater(scene) {
	// Water

	const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

	water = new THREE.Water(
		waterGeometry,
		{
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load('../assets/textures/waternormals.jpeg', function (texture) {

				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			}),
			alpha: 1.0,
			sunDirection: new THREE.Vector3(),
			sunColor: 0xff0000,
			waterColor: 0x000000,
			//001e0f
			distortionScale: 100,
			fog: scene.fog !== undefined
		}
	);

	water.rotation.x = - Math.PI / 2;
	scene.add(water);
}
/*
function loadModel(scene) {
	const onProgress = function (xhr) {

		if (xhr.lengthComputable) {

			const percentComplete = xhr.loaded / xhr.total * 100;
			console.log(Math.round(percentComplete, 2) + '% downloaded');

		}

	};

	const onError = function () { };

	const manager = new THREE.LoadingManager();


	new THREE.MTLLoader(manager)
		.setPath('../assets/models/nico/')
		.load('model_mesh.mtl', function (materials) {

			materials.preload();

			new THREE.OBJLoader(manager)
				.setMaterials(materials)
				.setPath('../assets/models/nico/')
				.load('model_mesh.obj', function (object) {

					object.position.y = 1;
					scene.add(object);

				}, onProgress, onError);

		});

}

function loadFbx(scene) {
	// model
	const loader = new THREE.FBXLoader();
	loader.load('../assets/models/candle/source/candels_flame_lp.fbx', function (object) {

		mixer = new THREE.AnimationMixer(object);

		const action = mixer.clipAction(object.animations[0]);
		action.play();

		object.traverse(function (child) {

			if (child.isMesh) {

				child.castShadow = true;
				child.receiveShadow = true;

			}

		});

		scene.add(object);

	});
}


function handleSuccess(stream) {
	// Put variables in global scope to make them available to the
	// browser console.
	window.stream = stream;
	const soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
	soundMeter.connectToSource(stream, function (e) {
		if (e) {
			alert(e);
			return;
		}
		meterRefresh = setInterval(() => {
			instantMeter.value = instantValueDisplay.innerText =
				soundMeter.instant.toFixed(2);
			slowMeter.value = slowValueDisplay.innerText =
				soundMeter.slow.toFixed(2);
			clipMeter.value = clipValueDisplay.innerText =
				soundMeter.clip;
		}, 200);
	});
}

function handleError(error) {
	console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}


function start(scene) {
	console.log('Requesting local stream');
	startButton.disabled = true;
	stopButton.disabled = false;

	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		window.audioContext = new AudioContext();
	} catch (e) {
		alert('Web Audio API not supported.');
	}

	navigator.mediaDevices
		.getUserMedia(constraints)
		.then(handleSuccess)
		.catch(handleError);
}

function stop(scene) {
	console.log('Stopping local stream');
	startButton.disabled = false;
	stopButton.disabled = true;

	window.stream.getTracks().forEach(track => track.stop());
	window.soundMeter.stop();
	clearInterval(meterRefresh);
	instantMeter.value = instantValueDisplay.innerText = '';
	slowMeter.value = slowValueDisplay.innerText = '';
	clipMeter.value = clipValueDisplay.innerText = '';
}

*/

/*    for (let i = 0; i < 10; i++) {
		let texture = new THREE.TextureLoader().load("../assets/texture.png");
		let myGeometry = new THREE.SphereGeometry(3, 12, 12);
		let myMaterial = new THREE.MeshBasicMaterial({ map: texture });
		myMesh = new THREE.Mesh(myGeometry, myMaterial);
		myMesh.position.set(i*5, 2, 5);
		scene.add(myMesh);
	}


	for (let i = 0; i < 5; i++) {
		let texture = new THREE.TextureLoader().load("../assets/texture.png");
		let myGeometry = new THREE.PlaneGeometry(10, 10, 10);
		let myMaterial = new THREE.MeshBasicMaterial({ map: texture });
		myMesh = new THREE.Mesh(myGeometry, myMaterial);
		myMesh.position.set(i * 10, 5, 10);
		myMesh.rotation.y = THREE.Math.degToRad(i*90)
		scene.add(myMesh);
	}

*/


	//const light = new THREE.HemisphereLight(0x000000, 0xE67C3B, 0.5);
	//scene.add(light);

/*	const width = 10;
	const height = 10;
	const intensity = 1;
	const rectLight = new THREE.RectAreaLight(0xffffff, intensity, width, height);
	rectLight.position.set(5, 5, 0);
	rectLight.lookAt(0, 0, 0);
	scene.add(rectLight);
*/


//	const rectLightHelper = new THREE.RectAreaLightHelper(rectLight);
//	rectLight.add(rectLightHelper);

//	const light = new THREE.RectAreaLight(0xffffbb, 1.0, 5, 5);
	//const helper = new RectAreaLightHelper(light);
//	light.add(helper);





/*const geometry = new THREE.PlaneGeometry(100, 100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
floor = new THREE.Mesh(geometry, material);
floor.position.set(0, .01, 0);
floor.rotation.x = THREE.Math.degToRad(90);
scene.add(floor);

floor = new THREE.Mesh(geometry, material);
floor.position.set(0, 10, 0);
floor.rotation.x = THREE.Math.degToRad(90);
scene.add(floor);

let myGeometry = new THREE.PlaneGeometry(50, 10, 10);
let texture = new THREE.TextureLoader().load("../assets/textures/gradient.jpg");
let myMaterial = new THREE.MeshBasicMaterial({ map: texture });
wall = new THREE.Mesh(myGeometry, myMaterial);
wall.position.set(25, 5, 0);
wall.rotation.y = THREE.Math.degToRad(90);
scene.add(wall);

wall = new THREE.Mesh(myGeometry, myMaterial);
wall.position.set(0, 5, 25);
wall.rotation.y = THREE.Math.degToRad(0);
scene.add(wall);

wall = new THREE.Mesh(myGeometry, myMaterial);
wall.position.set(0, 5, -25);
wall.rotation.y = THREE.Math.degToRad(0);
scene.add(wall);

wall = new THREE.Mesh(myGeometry, myMaterial);
wall.position.set(-25, 5, 0);
wall.rotation.y = THREE.Math.degToRad(90);
scene.add(wall);
*/

	//scene.fog = new THREE.FogExp2(0x232323, 0.025);



/*const intensity = 2.5;
const distance = 100;
const decay = 2.0;

const c1 = 0xff0040;*/
	//light1 = new THREE.PointLight(c1, intensity, distance, decay);
	//light1.add(new THREE.Mesh(sphere, new THREE.MeshPhongMaterial({ })));
	//scene.add(light1);
	//light1.position.set(0, 3, 0);