import * as Three from "three";
import {Camera, Scene, WebGLRenderer} from "three";
import {Figure, Graphic} from "@MLambda/abstract"


class Canvas implements Graphic {

    private readonly scene: Scene;
    private renderer: WebGLRenderer;
    private camera: Camera;
    private figures: Figure[]

    constructor() {
        this.scene = new Three.Scene();
        this.renderer = new Three.WebGLRenderer();
        this.camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.figures = [];
    }


    animate() {
        requestAnimationFrame(() => this.animate());
        this.figures.forEach(f => f.Update())
        this.renderer.render(this.scene, this.camera);
    }

    paint(camera: Three.Camera) {
        this.camera = camera;
        this.animate();
    }

    Add(figure: Figure): void {
        this.figures.push(figure);
        this.scene.add(figure.ToThing())
    }

}

export default Canvas;