import * as THREE from 'three';
export function G_z(path){
    // Chargez la texture de l'image
    const loader = new FontLoader();
    const texture = loader.load(path);
    // Créez un matériau avec la texture
    return texture;
}
