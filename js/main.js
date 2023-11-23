import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import { G_image_loader } from './texture_loader.js';
import { G_font_loader } from './font_loader.js';

//------------------ Create scene ------------------//
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//------------------ Create camera ------------------//
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 0);
camera.lookAt(0, 0, 0);
camera.position.z = 10;


//------------------ Create cube ------------------//
const geometry = new THREE.BoxGeometry(10, 10, 0);
const geometry2 = new THREE.BoxGeometry(1, 1, 0);
const material = G_image_loader('../img/logo_ECA.png');
const material2 = G_image_loader('../img/logo_ECA.png');
const cube = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry2, material2);
scene.add(cube);
scene.add(cube2);


//------------------ Create Text ------------------//
const font = G_font_loader('../font/Roboto_Regular.json');
const text1 = new TextGeometry(
    "Hello World",
    {
        font: font,
        size: 1,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 5
    }
);
const text2 = new TextGeometry(
    "Hello World",
    {
        font: font,
        size: 1,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 5
    }
);

text1.computeBoundingBox();
text2.computeBoundingBox();

const text1_mesh = new THREE.Mesh(text1, material);
const text2_mesh = new THREE.Mesh(text2, material);

scene.add(text1_mesh);
scene.add(text2_mesh);

text1_mesh.position.x = -2.5;
text1_mesh.rotation.y = 0.5;
text2_mesh.position.x = 2.5;
text2_mesh.position.z = -10;
text2_mesh.rotation.y = -0.5;


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
console.log(".");
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
                animation_camera = new TWEEN.Tween(camera.position).to({ z: camera.position.z+10 }, move_time)
                    .easing(TWEEN.Easing.Quadratic.InOut).start();
            }
            else if (event.deltaY < 0 && camera.position.z > camera_z_min){
                animation_camera = new TWEEN.Tween(camera.position).to({ z: camera.position.z-10 }, move_time)
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