import {Object3D} from "three";

export type Thing = Object3D

export interface Figure {
    ToThing(): Thing;

    Update(): void;
}

export interface Graphic {
    Add(figure: Figure): void
}

