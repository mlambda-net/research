import {Figure, Thing} from "@MLambda/abstract";
import * as THREE from "three";


export class Plane implements Figure {
    private plane: THREE.Mesh;

    constructor(x: number, y: number, z: number) {
        let geo = new THREE.PlaneGeometry(3, 3, 8, 8);
        let mat = new THREE.MeshBasicMaterial({color: "rgb(255,255,255)", side: THREE.DoubleSide});
        this.plane = new THREE.Mesh(geo, mat);
        this.plane.position.set(x, y, z);
    }


    Rotate() {

    }


    ToThing(): Thing {
        return this.plane;
    }

    Update(): void {
    }

}