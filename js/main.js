import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { G_image_loader } from './texture_loader.js';
import { G_font_loader } from './font_loader.js';
import { FontLoader }  from 'three/addons/loaders/FontLoader.js';

//------------------ Create scene ------------------//
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const vector = new THREE.Vector3();

//------------------ Create camera ------------------//
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 0);
camera.lookAt(0, 0, 0);
camera.position.z = 10;


//------------------ Create light ------------------//
scene.add(new THREE.AmbientLight(0xffffff));


//------------------ Create cube ------------------//
const geometry = new THREE.BoxGeometry(1, 1, 0);
const geometry2 = new THREE.BoxGeometry(1, 1, 0);
const material = G_image_loader('../img/logo_ECA.png');
const material2 = G_image_loader('../img/logo_ECA.png');
const cube = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry2, material2);
scene.add(cube);
scene.add(cube2);


//------------------ Create Text ------------------//
const loader = new FontLoader();

loader.load('../fonts/Akira.json', function (font) {
    const textgeo = new TextGeometry('Hello World', {
        font: font
    })

    const textmesh = new THREE.Mesh(textgeo,
        new THREE.MeshPhongMaterial({ color: 0x00ff00 }),
        //new THREE.MeshBasicMaterial({ color: 0x0000ff })
    )
    textmesh.castShadow = true;
    textmesh.position.y = -1;
    textmesh.position.x = -2.5;
    console.log(new THREE.Box3().setFromObject(textmesh).getSize(vector));
    textmesh.rotation.y = 0.5;
    textmesh.scale.z = 0.000;
    textmesh.scale.x = 0.005;
    textmesh.scale.y = 0.005;
    
    scene.add(textmesh);
});


//Cube 1
cube.rotation.y = 0.5;
cube.position.x = -2.5;

//Cube 2
cube2.rotation.y = -0.5;
cube2.position.x = 2.5;
cube2.position.z = -10;


//------------------ Animation ------------------//
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();

    render();

}

//------------------ Render ------------------//
function render() {
    renderer.render(scene, camera)
}


//------------------ Window Resize ------------------//
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


//------------------ Wheel ------------------//
var animation_camera = null;
var camera_z_min = 0;
var camera_z_max = 10;
const move_time = 1500;

addEventListener('mousewheel', function (event) {
    if (animation_camera != null) {

        if (!animation_camera.isPlaying()) {

            if (event.deltaY > 0 && camera.position.z < camera_z_max) {
                animation_camera = new TWEEN.Tween(camera.position).to({ z: camera.position.z + 10 }, move_time)
                    .easing(TWEEN.Easing.Quadratic.InOut).start();
            }
            else if (event.deltaY < 0 && camera.position.z > camera_z_min) {
                animation_camera = new TWEEN.Tween(camera.position).to({ z: camera.position.z - 10 }, move_time)
                    .easing(TWEEN.Easing.Quadratic.InOut).start();
            }
        }
    }
    else {
        if (event.deltaY > 0) {
            animation_camera = new TWEEN.Tween(camera.position).to({ z: 10 }, move_time)
                .easing(TWEEN.Easing.Quadratic.InOut).start();
        }
        else {
            animation_camera = new TWEEN.Tween(camera.position).to({ z: 0 }, move_time)
                .easing(TWEEN.Easing.Quadratic.InOut).start();
        }
    }
});



animate();