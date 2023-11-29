import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { lst_projects } from '../data/lst_projects.js';

var animation_camera = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, 0);
var camera_z_min = 10;
var camera_z_max = 10 - 10 * (lst_projects.length - 1);
const move_time = 1500;

var project_on_id = 0;

var WindowWidth = window.innerWidth;
var WindowHeight = window.innerHeight;

const group_orbs = new THREE.Group();
const orb_image = '../img/cercle.png';
const orb_number = 150;
var animation_orbs_color = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, 0);

var selectedObject = null;
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

var animation_projet_card = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, 0);

//Fonction pour charger une image en tant que texture de matériau
export function image_loader(path) {
    // Chargez la texture de l'image
    const loader = new THREE.TextureLoader();
    const texture = loader.load(path);
    // Créez un matériau avec la texture
    return new THREE.MeshBasicMaterial({ map: texture });
}

//Fonction déplacer la caméra
export function move_camera(camera, distance) {

    if (!animation_camera.isPlaying()) {
        if (camera.position.z + distance <= camera_z_min && camera.position.z + distance >= camera_z_max) {
            animation_camera = new TWEEN.Tween(camera.position)
                .to({ z: camera.position.z + distance }, move_time)
                .easing(TWEEN.Easing.Quadratic.InOut).start();
            project_on_id += distance / -10;
            change_orb_color(lst_projects[project_on_id].color);
        }
    }
}

//Fonction pour créer les cartes de projets
export function create_projects_cards() {
    const group_projects = new THREE.Group();
    var pos_x = 3;
    var rota_y = 0;
    var pos_z = 0;

    var geometry;
    var material;
    var cube;

    for (let i = 0; i < lst_projects.length; i++) {
        if (lst_projects[i].id % 2 == 0) {
            pos_x = 3;
            rota_y = -0.5;
        }
        else {
            pos_x = -3;
            rota_y = 0.5;
        }
        pos_z = lst_projects[i].id * -10;
        geometry = new THREE.BoxGeometry(3, 1.5, 0);
        material = image_loader(lst_projects[i].image);
        cube = new THREE.Mesh(geometry, material);
        cube.position.z = pos_z;
        cube.rotation.y = rota_y;
        cube.position.x = pos_x;
        cube.name = lst_projects[i].name;
        cube.id_project = lst_projects[i].id;
        cube.org_x = pos_x;
        cube.org_y = 0;
        cube.org_z = pos_z;

        group_projects.add(cube);
    }
    return group_projects;
}

//Fonction pour créer les orbes de fond
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

//Fonction pour savoir quel objet est sélectionné par le pointeur
export function get_inter_object(camera, scene) {
    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children)
    if (intersects.length > 0) {
        if ("id_project" in intersects[0].object) {
            selectedObject = intersects[0].object;
        } else {
            selectedObject = null;
        }
    }
    return selectedObject;
}

//Fonction calculer les coordonnées du pointeur
export function onPointerMove(event) {

    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    show_project_info(selectedObject)

}

//Fonction pour changer la couleur des orbes
function change_orb_color(color) {

    var coul_r = [], coul_b = [], coul_g = [];
    for (var c = 0; c < group_orbs.children.length; c++) {
        coul_r.push(color[0] * Math.random());
        coul_g.push(color[1] * Math.random());
        coul_b.push(color[2] * Math.random());
    }

    if (!animation_orbs_color.isPlaying()) {
        for (var i = 0; i < group_orbs.children.length; i++) {
            animation_orbs_color = new TWEEN.Tween(group_orbs.children[i].material.color).to({ r: coul_r[i], g: coul_g[i], b: coul_b[i] }, move_time)
                .easing(TWEEN.Easing.Quadratic.InOut).start();
        }
    }
    

}

function show_project_info(project) {
    //project est l'object threejs
    if (project != null) {
        if (project.id_project == project_on_id) {
            if (!animation_projet_card.isPlaying()) {
                if (project.org_x == project.position.x) {
                    if (project.org_x >= 0) {
                        animation_projet_card = new TWEEN.Tween(project.position)
                            .to({ x: project.position.x - 2, z: project.position.z - 2 }, move_time)
                            .easing(TWEEN.Easing.Quadratic.InOut).start();
                    }
                    else {
                        animation_projet_card = new TWEEN.Tween(project.position)
                            .to({ x: project.position.x + 2, z: project.position.z - 2 }, move_time)
                            .easing(TWEEN.Easing.Quadratic.InOut).start();
                    }
                    
                }
            }
        }
    }
    else if(){
        if (project.id_project == project_on_id) {
            if (!animation_projet_card.isPlaying()) {
                if (project.org_x == project.position.x) {
                    if (project.org_x >= 0) {
                        animation_projet_card = new TWEEN.Tween(project.position)
                            .to({ x: project.position.x + 2, z: project.position.z + 2 }, move_time)
                            .easing(TWEEN.Easing.Quadratic.InOut).start();
                    }
                    else {
                        animation_projet_card = new TWEEN.Tween(project.position)
                            .to({ x: project.position.x -2 , z: project.position.z + 2 }, move_time)
                            .easing(TWEEN.Easing.Quadratic.InOut).start();
                    }
                }
            }
        }
    }
}