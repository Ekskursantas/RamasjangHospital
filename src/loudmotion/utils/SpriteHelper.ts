

import {Sprite} from "pixi.js";
import {Logger} from "./debug/Logger";

export class SpriteHelper extends Sprite {

    public static hitTest(s1, s2): boolean {
        let hit: boolean;
        // Logger.log(this, "hitTest (s1.x - s1.width * .5) + (s1.width * .5) > (s2.x - s2.width * .5) == "+((s1.x - s1.width * .5) + (s1.width * .5) > (s2.x - s2.width * .5)));
        // Logger.log(this, "hitTest ((s1.x - s1.width * .5) < (s2.x - s2.width * .5) + (s2.width * .5)) == "+((s1.x - s1.width * .5) < (s2.x - s2.width * .5) + (s2.width * .5)));
        // Logger.log(this, "hitTest ((s1.y - s1.height * .5) + (s1.height * .5) > (s2.y - s2.height * .5)) == "+((s1.y - s1.height * .5) + (s1.height * .5) > (s2.y - s2.height * .5)));
        // Logger.log(this, "hitTest ((s1.y - s1.height * .5) < (s2.y - s2.height * .5) + (s2.height * .5)) == "+((s1.y - s1.height * .5) < (s2.y - s2.height * .5) + (s2.height * .5)));
        // Logger.log(this, "hitTest s1.x == "+s1.x);
        // Logger.log(this, "hitTest s1.y == "+s1.y);
        // Logger.log(this, "hitTest s1.width == "+s1.width);
        // Logger.log(this, "hitTest s1.height == "+s1.height);
        // Logger.log(this, "hitTest s2.x == "+s2.x);
        // Logger.log(this, "hitTest s2.y == "+s2.y);
        // Logger.log(this, "hitTest s2.width == "+s2.width);
        // Logger.log(this, "hitTest s2.height == "+s2.height);
        if ((s1.x - s1.width * .5) + (s1.width * .5) > (s2.x - s2.width * .5)) {
            if ((s1.x - s1.width * .5) < (s2.x - s2.width * .5) + (s2.width * .5)) {
                if ((s1.y - s1.height * .5) + (s1.height * .5) > (s2.y - s2.height * .5)) {
                    if ((s1.y - s1.height * .5) < (s2.y - s2.height * .5) + (s2.height * .5)) {
                        hit = true;
                    }
                }
            }
        }

        // Logger.log(this, "SpriteHelper hitTest hit == "+hit);
        return hit;
    }


    private checkCollision(obj1: Sprite, obj2: Sprite):boolean{
        // let p1:Point = new Point(obj1.x + obj1.width/2, obj1.y + obj1.height/2); //TODO
        // let p2:Point = new Point(obj2.x + obj2.width/2, obj2.y + obj2.height/2);
        //
        // let distance:number = Point.distance(p1, p2);
        // let radius1:number = 60;
        // let radius2:number = 60;
        //
        // return (distance < radius1 + radius2);

        return false; //TODO temp
    }

}
