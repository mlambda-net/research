import {Point} from "@MLambda/figures/point";
import {Figure, Thing} from "@MLambda/abstract";
import * as THREE from "three";


export class Line implements Figure {
    private readonly line: Thing;

    constructor(a: Point, b: Point) {

        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({color: 'rgb(255,255,255)'});

        geometry.setFromPoints([
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 1, 0)
        ]);
        this.line = new THREE.Line(geometry, material);

    }

    ToThing(): Thing {
        return this.line;
    }

    Update(): void {
        this.line.rotation.x += 0.01;
        this.line.rotation.y += 0.01;
    }


}