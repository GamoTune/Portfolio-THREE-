import * as THREE from 'three';
import { FontLoader }  from 'three/addons/loaders/FontLoader.js';
export function G_font_loader(path){
    // Chargez la texture de l'image
    const loader = new FontLoader();
    const texture = loader.load(path);
    // Créez un matériau avec la texture
    return new THREE.MeshBasicMaterial({ map: texture });
}

