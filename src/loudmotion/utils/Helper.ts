/**
 * Created by loudmotion on 28/02/2017.
 */

import {Logger} from "src/loudmotion/utils/debug/Logger";
import {Point} from "pixi.js";

export class Helper {

    public static lineDistance(point1: Point, point2: Point) :number{
        let xs: number = 0;
        let ys: number = 0;

        xs = point2.x - point1.x;
        xs = xs * xs;

        ys = point2.y - point1.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    }

    public static randomRange(__min:number, __max:number, __rounded:boolean = false):number {
        let n:number = __min + (Math.random() * (__max - __min));
        return __rounded ? Math.round(n) : n;
    }
}
