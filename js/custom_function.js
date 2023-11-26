import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { lst_projects } from '../data/lst_projects.js';
import exp from 'constants';

var animation_camera = null;
var camera_z_min = 10;
var camera_z_max = 10 - 10 * (lst_projects.length - 1);
const move_time = 1500;

var pos_x = 3;
var rota_y = 0;
var pos_z = 0;

var WindowWidth = window.innerWidth;
var WindowHeight = window.innerHeight;

const orb_image = '../img/cercle.png';
const nbr_line = 20;
const nbr_column = 20;

var selectedObject = null;
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

export function image_loader(path) {
    // Chargez la texture de l'image
    const loader = new THREE.TextureLoader();
    const texture = loader.load(path);
    // Créez un matériau avec la texture
    return new THREE.MeshBasicMaterial({ map: texture });
}

export function move_camera(camera, distance) {

    if (animation_camera != null) {

        if (!animation_camera.isPlaying()) {

            if (distance < 0) {
                if (camera.position.z > camera_z_max) {
                    animation_camera = new TWEEN.Tween(camera.position).to({ z: camera.position.z + distance }, move_time)
                        .easing(TWEEN.Easing.Quadratic.InOut).start();
                }
            }
            else {
                if (camera.position.z < camera_z_min) {
                    animation_camera = new TWEEN.Tween(camera.position).to({ z: camera.position.z + distance }, move_time)
                        .easing(TWEEN.Easing.Quadratic.InOut).start();
                }
            }
        }
    }
    else {
        if (distance < 0) {
            animation_camera = new TWEEN.Tween(camera.position).to({ z: camera.position.z + distance }, move_time)
                .easing(TWEEN.Easing.Quadratic.InOut).start();
        }
        else if (camera.position.z < camera_z_min) {
            animation_camera = new TWEEN.Tween(camera.position).to({ z: camera.position.z + distance }, move_time)
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
    cube.name = "project"
    return cube;
}

export function create_backgound_orbs() {
    const group_orbs = new THREE.Group();
    for (var i = 0; i < 100; i++) {

        const map = new THREE.TextureLoader().load(orb_image);

        var coul_b = 0.5 + 0.5 * Math.random();
        var coul_rv = 0.1 * Math.random();
        const material = new THREE.SpriteMaterial({ map: map, color: new THREE.Color(coul_rv, coul_rv, coul_b), transparent: true });

        //const material = new THREE.SpriteMaterial({ map: map, color: Math.random() * 0x808008 + 0x808080, transparent: true });
        const orb = new THREE.Sprite(material);
        orb.position.x = Math.random() * 100 - 50;
        orb.position.y = Math.random() * 30 - 15;
        orb.position.z = Math.random() * -100 - 50;
        orb.scale.x = orb.scale.y = Math.random() * 40 - 20;;
        group_orbs.add(orb);
    }

    return group_orbs;
}

export function create_backgound_orbsORG() {
    const group_orbs = new THREE.Group();
    for (var i = 0; i < nbr_line; i++) {
        for (var j = 0; j < nbr_column; j++) {
            const map = new THREE.TextureLoader().load(orb_image);
            const material = new THREE.SpriteMaterial({ map: map, color: Math.random() * 0x808008 + 0x808080, transparent: true });
            const orb = new THREE.Sprite(material);
            orb.position.x = j * 5 - 20;
            orb.position.y = i * 5 - 5;
            orb.position.z = -50;
            orb.scale.x = orb.scale.y = 25;
            group_orbs.add(orb);
        }
    }

    return group_orbs;
}

export function animate_orbs(group_orbs) {
    for (var i = 0; i < group_orbs.children.length; i++) {
        group_orbs.children[i].position.x += 0.05;
        if (group_orbs.children[i].position.x > 50) {
            group_orbs.children[i].position.x = -50;
        }
    }
}

export function get_inter_object(camera, scene) {
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
    return selectedObject;
}

export function onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

}