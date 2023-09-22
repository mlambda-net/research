import {Figure, Thing} from "@MLambda/abstract";
import * as THREE from "three";
import {BufferGeometry, Points, PointsMaterial} from "three";


export class Point implements Figure {

    private readonly dot: Thing;

    constructor(x: number, y: number, z: number) {
        let geometry = new BufferGeometry();

        const points = [
            new THREE.Vector3(x, y, z),
        ];
        geometry.setFromPoints(points);
        let material = new PointsMaterial({size: 0.01, color: 'rgb(27,23,85)'});
        this.dot = new Points(geometry, material);
    }


    ToThing(): Thing {
        return this.dot;
    }

    Update(): void {

    }


}