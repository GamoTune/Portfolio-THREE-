import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { lst_projects } from '../data/lst_projects.js';


var animation_camera = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, 0);
var animation_camera_rotate = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, 0);
var camera_z_min = 10;
var camera_z_max = 10 - 10 * (lst_projects.length - 1);
const move_time_camera = 1500;

var project_on_id = 0;

export const group_orbs = new THREE.Group();
const orb_image = '../img/cercle.png';
const orb_number = 150;
var animation_orbs_color = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, 0);

var selectedObject = null;
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

var animation_projet_card = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, 0);
var shift_card = null;
const move_time_card = 500;

var tim = 0;
var r;

var animation_project_infos_coords = new TWEEN.Tween({ x: 0 }).to({ x: 0 }, 0);
var big_card = null;

//Fonction pour charger une image en tant que texture de matériau
export function image_loader(path) {
    // Chargez la texture de l'image
    const loader = new THREE.TextureLoader();
    const texture = loader.load(path);
    // Créez un matériau avec la texture
    return new THREE.MeshBasicMaterial({ map: texture });
}

function createMaterialArray(project) {
    const skyboxImagepaths = [
        project.imageFace,
        project.imageFace,
        project.imageFace,
        project.imageFace,
        project.imageFace,
        project.imageDos,
    ];
    const materialArray = skyboxImagepaths.map(image => {
        let texture = new THREE.TextureLoader().load(image);

        return new THREE.MeshBasicMaterial({ map: texture, side: THREE.FrontSide });
    });
    return materialArray;
}

//Fonction déplacer la caméra
export function move_camera(camera, distance) {

    if (!animation_camera.isPlaying()) {
        if (camera.position.z + distance <= camera_z_min && camera.position.z + distance >= camera_z_max) {
            animation_camera = new TWEEN.Tween(camera.position)
                .to({ z: camera.position.z + distance }, move_time_camera)
                .easing(TWEEN.Easing.Quadratic.InOut).start();
            project_on_id += distance / -10;
            change_orb_color(lst_projects[project_on_id].color);
        }
    }
}

export function rotate_camera_to(camera, angle) {

    if(!animation_camera_rotate.isPlaying()){
        animation_camera_rotate = new TWEEN.Tween(camera.rotation)
        .to({ x: angle }, move_time_camera)
        .easing(TWEEN.Easing.Quadratic.InOut).start();
    }

}

//Fonction pour créer les cartes de projets

export function create_projects_cards() {
    const group_projects = new THREE.Group();
    var pos_x = 3;
    var rota_y = 0;
    var pos_z = 0;

    var geometry;
    var materials;
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
        materials = createMaterialArray(lst_projects[i])
        cube = new THREE.Mesh(geometry, materials);
        cube.position.z = pos_z;
        cube.rotation.y = rota_y;
        cube.position.x = pos_x;
        cube.name = lst_projects[i].name;
        cube.id_project = lst_projects[i].id;
        cube.org_x = pos_x;
        cube.org_y = 0;
        cube.org_z = pos_z;
        cube.org_rota_y = rota_y;

        group_projects.add(cube);
    }
    return group_projects;
}

//Fonction pour créer les orbes de fond
export function create_backgound_orbs() {

    for (var i = 0; i < orb_number; i++) {

        const map = new THREE.TextureLoader().load(orb_image);

        const material = new THREE.SpriteMaterial({ map: map, color: new THREE.Color(0,0,0), transparent: true });

        const orb = new THREE.Sprite(material);
        orb.position.x = Math.random() * 80 - 40;
        orb.position.y = Math.random() * 40 - 20;
        orb.position.z = Math.random() * - 100 - 50;
        orb.org_x = orb.position.x;
        orb.org_y = orb.position.y;
        orb.org_z = orb.position.z;

        var rayon = Math.random() * 40 - 20;
        orb.scale.x = orb.scale.y = rayon;
        orb.vr = 20 / rayon * 0.3;//(Math.random()-0.5)*2;
        group_orbs.add(orb);
    }

    change_orb_color(lst_projects[0].color);

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
            animation_orbs_color = new TWEEN.Tween(group_orbs.children[i].material.color).to({ r: coul_r[i], g: coul_g[i], b: coul_b[i] }, move_time_camera)
                .easing(TWEEN.Easing.Quadratic.InOut).start();
        }
    }
}

//Fonctoin pour afficher le projet sélectionné
export function move_project() {
    if (selectedObject != null) {
        if (selectedObject.id_project == project_on_id) {
            if (selectedObject.org_x == selectedObject.position.x) {
                animation_projet_card = new TWEEN.Tween(selectedObject.position)
                    .to({ x: selectedObject.position.x - (selectedObject.org_x / 2), z: selectedObject.position.z + 2 }, move_time_card)
                    .easing(TWEEN.Easing.Quadratic.InOut).start();
            }
            shift_card = selectedObject;
        }
    }
    else if (shift_card != null && !animation_project_infos_coords.isPlaying()) {
        animation_projet_card = new TWEEN.Tween(shift_card.position)
            .to({ x: shift_card.org_x, z: shift_card.org_z }, move_time_card)
            .easing(TWEEN.Easing.Quadratic.InOut).start();
        shift_card = null;
    }
}

export function move_orbs() {
    group_orbs.children.forEach((element, index) => {
        r = 2.5 * Math.sin(element.vr * tim * 0.0007 + index);
        element.position.x = element.org_x + r * Math.cos(element.vr * tim * 0.005 + index);
        element.position.y = element.org_y + r * Math.sin(element.vr * tim * 0.0057 + index);
    });
    tim++;
}

export function show_project_infos() {
    if (shift_card != null) {
        window.open(lst_projects[project_on_id].link);
    }
}
