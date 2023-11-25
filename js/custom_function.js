import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';


var animation_groupe_project = null;
var camera_z_min = 0;
var camera_z_max = 10;
const move_time = 1500;
var pos_x = 3;
var rota_y = 0;
var pos_z = 0;
var WindowWidth = window.innerWidth;
var WindowHeight = window.innerHeight;



export function image_loader(path) {
    // Chargez la texture de l'image
    const loader = new THREE.TextureLoader();
    const texture = loader.load(path);
    // Créez un matériau avec la texture
    return new THREE.MeshBasicMaterial({ map: texture });
}

export function move_project_items(groupe, direction) {

    if (animation_groupe_project != null) {

        if (!animation_groupe_project.isPlaying()) {

            if (direction > 0 && groupe.position.z < camera_z_max) {
                animation_groupe_project = new TWEEN.Tween(groupe.position).to({ z: groupe.position.z + 10 }, move_time)
                    .easing(TWEEN.Easing.Quadratic.InOut).start();
            }
            else if (direction < 0 && groupe.position.z > camera_z_min) {
                animation_groupe_project = new TWEEN.Tween(groupe.position).to({ z: groupe.position.z - 10 }, move_time)
                    .easing(TWEEN.Easing.Quadratic.InOut).start();
            }
        }
    }
    else {
        if (direction > 0) {
            animation_groupe_project = new TWEEN.Tween(groupe.position).to({ z: groupe.position.z + 10 }, move_time)
                .easing(TWEEN.Easing.Quadratic.InOut).start();
        }
    }
}

export function create_new_project_item(project) {
    if (project.id % 2 == 0) {
        pos_x = 3;
        rota_y = -0.5;
    }
    else {
        pos_x = -3;
        rota_y = 0.5;
    }
    pos_z = project.id * -10;
    const geometry = new THREE.BoxGeometry(3, 1.5, 0);
    const material = image_loader(project.image);
    const cube = new THREE.Mesh(geometry, material);
    cube.position.z = pos_z;
    cube.rotation.y = rota_y;
    cube.position.x = pos_x;
    return cube;
}