import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { lst_projects } from '../data/lst_projects.js';
import { group_projects } from './main.js';

var animation_camera = null;
var camera_z_min = 10;
var camera_z_max = 10 - 10 * (lst_projects.length - 1);
const move_time = 1500;

var project_on = null;

var pos_x = 3;
var rota_y = 0;
var pos_z = 0;

var WindowWidth = window.innerWidth;
var WindowHeight = window.innerHeight;

const group_orbs = new THREE.Group();
const orb_image = '../img/cercle.png';
const orb_number = 150;
var animation_orbs_color = null;

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
    if (animation_camera != null) {
        if (animation_camera.isPlaying()) {
            project_on = what_is_project_on(camera.position.z, group_projects);
        }
        if (project_on != null) {
            //console.log(project_on.color); // Y A UN BUG ICI AVEC LES COULEURS. En gros, la marche arrière ne marche pas et quand on arrive sur le dernier bah il prend la couleur du premier.
            change_orb_color(project_on.color);
        }
    }
}

export function create_projects_cards(project) {
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

    for (var i = 0; i < orb_number; i++) {

        const map = new THREE.TextureLoader().load(orb_image);

        var coul_r = 0.5 + 0.5 * Math.random();
        var coul_g = 0.5 + 0.5 * Math.random();
        var coul_b = 0.5 + 0.5 * Math.random();
        var coul_rv = 0.1 * Math.random();
        const material = new THREE.SpriteMaterial({ map: map, color: new THREE.Color(coul_r, 0, coul_b), transparent: true });

        const orb = new THREE.Sprite(material);
        orb.position.x = Math.random() * 80 - 40;
        orb.position.y = Math.random() * 40 - 20;
        orb.position.z = Math.random() * - 100 - 50;
        orb.scale.x = orb.scale.y = Math.random() * 40 - 20;
        group_orbs.add(orb);
    }

    return group_orbs;
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

function change_orb_color(color) {

    var coul_r = [], coul_b = [], coul_g = [];
    for (var c = 0; c < group_orbs.children.length; c++) {
        coul_r.push(color[0] * Math.random());
        coul_g.push(color[1] * Math.random());
        coul_b.push(color[2] * Math.random());
    }

    if (animation_orbs_color != null) {
        if (!animation_orbs_color.isPlaying()) {
            for (var i = 0; i < group_orbs.children.length; i++) {
                animation_orbs_color = new TWEEN.Tween(group_orbs.children[i].material.color).to({ r: coul_r[i], g: coul_g[i], b: coul_b[i] }, move_time)
                    .easing(TWEEN.Easing.Quadratic.InOut).start();
            }
        }
    }
    else {
        for (var i = 0; i < group_orbs.children.length; i++) {
            animation_orbs_color = new TWEEN.Tween(group_orbs.children[i].material.color).to({ r: coul_r[i], g: coul_g[i], b: coul_b[i] }, move_time)
                .easing(TWEEN.Easing.Quadratic.InOut).start();
        }
    }
}

function what_is_project_on(z) {
    console.log("Camera Z : " + z);
    for (var i = 0; i < lst_projects.length; i++) {
        
        if (z/10 == lst_projects[i].id) {
            
            return lst_projects[i];
        }
    }



}