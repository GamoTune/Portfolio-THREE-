import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';


var animation_groupe_project = null;
var group_icon_project_z_min = 0;
var group_icon_project_z_max = 10;
const move_time = 1500;

var pos_x = 3;
var rota_y = 0;
var pos_z = 0;

var WindowWidth = window.innerWidth;
var WindowHeight = window.innerHeight;

const orb_image = '../img/cercle.png';
const nbr_line = 20;
const nbr_column = 20;



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

            if (direction > 0 && groupe.position.z < group_icon_project_z_max) {
                animation_groupe_project = new TWEEN.Tween(groupe.position).to({ z: groupe.position.z + 10 }, move_time)
                    .easing(TWEEN.Easing.Quadratic.InOut).start();
            }
            else if (direction < 0 && groupe.position.z > group_icon_project_z_min) {
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
export function create_backgound_orbs(){
    const group_orbs = new THREE.Group();
    for(var i = 0; i < 100; i++){
        
        const map = new THREE.TextureLoader().load(orb_image);
       
        var coul_b = 0.5+0.5*Math.random(); 
        var coul_rv =0.1*Math.random(); 
        const material = new THREE.SpriteMaterial({ map: map, color: new THREE.Color(coul_rv,coul_rv,coul_b), transparent: true });

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
export function create_backgound_orbsORG(){
    const group_orbs = new THREE.Group();
    for(var i = 0; i < nbr_line; i++){
        for(var j = 0; j < nbr_column; j++){
        const map = new THREE.TextureLoader().load(orb_image);
        const material = new THREE.SpriteMaterial({ map: map, color: Math.random() * 0x808008 + 0x808080, transparent: true });
        const orb = new THREE.Sprite(material);
        orb.position.x = j*5-20;
        orb.position.y = i*5-5;
        orb.position.z = -50;
        orb.scale.x = orb.scale.y = 25;
        group_orbs.add(orb);
    }}

    return group_orbs;
}

export function animate_orbs(group_orbs){
    for(var i = 0; i < group_orbs.children.length; i++){
        group_orbs.children[i].position.x += 0.05;
        if(group_orbs.children[i].position.x > 50){
            group_orbs.children[i].position.x = -50;
        }
    }
}