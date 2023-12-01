import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import {
    move_camera,
    create_projects_cards,
    create_backgound_orbs,
    get_inter_object,
    onPointerMove,
    show_project_info,
    group_orbs
} from './custom_function.js';

var tim=0;

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


//------------------ Create Projects Cards ------------------//
scene.add(create_projects_cards());


//------------------ Create Sprite ------------------//
scene.add(create_backgound_orbs());


//------------------ Animation ------------------//
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();

    render();
}


//------------------ Render ------------------//
var selectedObject;
var r;
function render() {
    selectedObject = get_inter_object(camera,scene);
    show_project_info(selectedObject);
    group_orbs.children.forEach((element,index) => {
        r=2.5*Math.sin(element.vr*tim*0.0007+index);
        element.position.x=element.org_x+r*Math.cos(element.vr*tim*0.005+index);
        element.position.y=element.org_y+r*Math.sin(element.vr*tim*0.0057+index);
    });

    tim++;
    renderer.render(scene, camera);
}


//------------------ Check window ratio ------------------//
function check_window_ratio() {
    if (window.innerWidth / window.innerHeight < 1.8) {
        //Affiche le message que la page n'est pas optimisé pour le ratio de l'écran
    }
}

//------------------ Mouse ------------------//
window.addEventListener('pointermove', onPointerMove);

window.addEventListener('click', function (event) {
    if (selectedObject != null) {
        move_camera(camera, selectedObject.org_z-camera.position.z+10);
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
        move_camera(camera, -10);
    }
    else if (event.deltaY > 0) {
        //scroll down
        move_camera(camera, 10);
    }
});


//------------------ Start ------------------//
animate();