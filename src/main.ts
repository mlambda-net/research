import * as Three from 'three'
import Canvas from "./canvas";
import {Point} from "@MLambda/figures/point";
import {Plane} from "@MLambda/figures/plane";


function run() {
    const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const canvas = new Canvas();
    camera.position.z = 5;
    camera.position.x = 0;
    let plane_x = new Plane(0, 0, 0)

    plane_x.Rotate([90, 0, 0])

    canvas.Add(new Point(0, 0, 0.01))
    canvas.Add(plane_x);


    canvas.paint(camera);
}

run();