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
var selectedObject = null;
function render() {
    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        if (intersects[0].object.name == "project") {
            selectedObject = intersects[0].object;
        } else {
            selectedObject = null;
        }
    }
    renderer.render(scene, camera)
}


//------------------ Check window ratio ------------------//
function check_window_ratio() {
    if (window.innerWidth / window.innerHeight < 1.8) {
        //Affiche le message que la page n'est pas optimisé pour le ratio de l'écran

    }
}


//------------------ Mouse ------------------//
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

}
window.addEventListener('pointermove', onPointerMove);

window.addEventListener('click', function (event) {
    if (selectedObject) {
        // selectedObject.material.color.set(0xff0000);
        // console.log(selectedObject.position.z);
        camera.position.z = selectedObject.position.z + 10;
    }
});

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
        // move_project_items(group, 1);
        camera.position.z += 1;
    }
    else if (event.deltaY > 0) {
        //scroll down
        // move_project_items(group, -1);
        camera.position.z -= 1;
    }
});





animate();