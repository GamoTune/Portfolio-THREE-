import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { move_project_items, create_new_project_item } from './custom_function.js';
import { lst_projects } from '../data/lst_projects.js';


//------------------ Create scene ------------------//
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//------------------ Create camera ------------------//
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 0);
camera.lookAt(0, 0, 0);
camera.position.z = 10;


//------------------ Create light ------------------//
scene.add(new THREE.AmbientLight(0xffffff));


//------------------ Create cube ------------------//
const group = new THREE.Group();

for (var i = 0; i < lst_projects.length; i++) {
    group.add(create_new_project_item(lst_projects[i]));
}

scene.add(group);


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
    camera.aspect = (window.innerWidth / window.innerHeight)
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


//------------------ Wheel ------------------//
addEventListener('mousewheel', function (event) {
    if (event.deltaY < 0) {
        //scroll up
        move_project_items(group, 1);
    }
    else if (event.deltaY > 0) {
        //scroll down
        move_project_items(group, -1);
    }
});



animate();