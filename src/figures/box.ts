import * as Three from "three";
import {Figure, Thing} from "@MLambda/abstract";

export class Box implements Figure {
    private readonly item: any;

    constructor(x: number, y: number, z: number) {
        const geometry = new Three.BoxGeometry(1, 1, 1);
        const material = new Three.MeshBasicMaterial({color: 0x00ff00})
        this.item = new Three.Mesh(geometry, material);
        this.item.position.set(x, y, z)
    }

    ToThing(): Thing {
        return this.item;
    }

    Update(): void {
        this.item.rotation.x += 0.01;
        this.item.rotation.y += 0.01;
    }

}