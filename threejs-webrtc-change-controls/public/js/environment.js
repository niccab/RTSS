let myMesh;
let wall;
let floor;
let moon;
let water;



function createEnvironment(scene) {
    console.log("Adding environment");
	//loadModel(scene);
	//loadFbx(scene);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	scene.add(directionalLight);

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

	let moonGeometry = new THREE.SphereGeometry(3, 12, 12);
	let moontexture = new THREE.TextureLoader().load("../assets/textures/moon.jpg");
	let moonMaterial = new THREE.MeshBasicMaterial({ map: moontexture });
	moon = new THREE.Mesh(moonGeometry, moonMaterial);
	moon.position.set(20, 13, 5);
	scene.add(moon);

	addWater(scene);

}

function updateEnvironment(scene) {
  // myMesh.position.x += 0.01;
	water.material.uniforms['time'].value += 1.0 / 60.0;
}


function addWater(scene) {
	// Water

	const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

	water = new THREE.Water(
		waterGeometry,
		{
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: new THREE.TextureLoader().load('../assets/waternormals.jpeg', function (texture) {

				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			}),
			alpha: 1.0,
			sunDirection: new THREE.Vector3(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 100,
			fog: scene.fog !== undefined
		}
	);

	water.rotation.x = - Math.PI / 2;
	scene.add(water);
}


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