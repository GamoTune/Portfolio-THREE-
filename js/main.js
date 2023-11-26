import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { move_project_items, create_new_project_item, create_backgound_orbs, animate_orbs } from './custom_function.js';
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
camera.updateProjectionMatrix();


//------------------ Create light ------------------//
scene.add(new THREE.AmbientLight(0xffffff));


//------------------ Create cube ------------------//
const group = new THREE.Group();

for (var i = 0; i < lst_projects.length; i++) {
    group.add(create_new_project_item(lst_projects[i]));
}

scene.add(group);


//------------------ Create Sprite ------------------//
scene.add(create_backgound_orbs());


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


//------------------ Check window ratio ------------------//
function check_window_ratio() {
    if (window.innerWidth/window.innerHeight < 1.8) {
        //Affiche le message que la page n'est pas optimisé pour le ratio de l'écran
    }
}

//------------------ Window Resize ------------------//
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = (window.innerWidth / window.innerHeight)
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    check_window_ratio()
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