/**
 * Created by loudmotion on 04/03/2017.
 */
// =================================================================================================
//
//	Starling Framework
//	Copyright 2011 Gamua OG. All Rights Reserved.
//
//	This program is free software. You can redistribute and/or modify it
//	in accordance with the terms of the accompanying license agreement.
//
// =================================================================================================

// package starling.utils
// {
//     import flash.geom.Matrix;
//     import flash.geom.Matrix3D;
//     import flash.geom.Point;

    // import starling.errors.AbstractClassError;

    import {Matrix, Point} from "pixi.js";
/** A utility class containing methods related to the Matrix class. */
    
export class MatrixUtils {
    /** Helper object. */
    private static sRawData:number[] = [1, 0, 0, 0,  0, 1, 0, 0,  0, 0, 1, 0,  0, 0, 0, 1];
    
        /** @private */
        constructor() {
            throw new Error();
        }
    
        /** Converts a 2D matrix to a 3D matrix. If you pass a 'resultMatrix',
         *  the result will be stored in this matrix instead of creating a new object. */
    // public static convertTo3D(matrix:Matrix, resultMatrix:Matrix3D=null):Matrix3D {
    //     if (resultMatrix == null) resultMatrix = new Matrix3D();
    //
    //     this.sRawData[0] = matrix.a;
    //     this.sRawData[1] = matrix.b;
    //     this.sRawData[4] = matrix.c;
    //     this.sRawData[5] = matrix.d;
    //     this.sRawData[12] = matrix.tx;
    //     this.sRawData[13] = matrix.ty;
    //
    //     resultMatrix.copyRawDataFrom(this.sRawData);
    //     return resultMatrix;
    // }
    
    /** Uses a matrix to transform 2D coordinates into a different space. If you pass a
     *  'resultPoint', the result will be stored in this point instead of creating a new object.*/
    public static transformCoords(matrix:Matrix, x:number, y:number, resultPoint:Point=null):Point {
        if (resultPoint == null) resultPoint = new Point();
    
        resultPoint.x = matrix.a * x + matrix.c * y + matrix.tx;
        resultPoint.y = matrix.d * y + matrix.b * x + matrix.ty;
    
        return resultPoint;
    }
    
    /** Appends a skew transformation to a matrix (angles in radians). The skew matrix
     *  has the following form:
     *  <pre>
     *  | cos(skewY)  -sin(skewX)  0 |
     *  | sin(skewY)   cos(skewX)  0 |
     *  |     0            0       1 |
     *  </pre>
     */
    public static skew(matrix:Matrix, skewX:number, skewY:number):void {
        let sinX:number = Math.sin(skewX);
        let cosX:number = Math.cos(skewX);
        let sinY:number = Math.sin(skewY);
        let cosY:number = Math.cos(skewY);
    
        matrix.set(matrix.a  * cosY - matrix.b  * sinX,
            matrix.a  * sinY + matrix.b  * cosX,
            matrix.c  * cosY - matrix.d  * sinX,
            matrix.c  * sinY + matrix.d  * cosX,
            matrix.tx * cosY - matrix.ty * sinX,
            matrix.tx * sinY + matrix.ty * cosX);
    }
    
    /** Prepends a matrix to 'base' by multiplying it with another matrix. */
    public static prependMatrix(base:Matrix, prep:Matrix):void {
        base.set(base.a * prep.a + base.c * prep.b,
            base.b * prep.a + base.d * prep.b,
            base.a * prep.c + base.c * prep.d,
            base.b * prep.c + base.d * prep.d,
            base.tx + base.a * prep.tx + base.c * prep.ty,
            base.ty + base.b * prep.tx + base.d * prep.ty);
    }
    
    /** Prepends an incremental translation to a Matrix object. */
    public static prependTranslation(matrix:Matrix, tx:number, ty:number):void {
        matrix.tx += matrix.a * tx + matrix.c * ty;
        matrix.ty += matrix.b * tx + matrix.d * ty;
    }
    
    /** Prepends an incremental scale change to a Matrix object. */
    public static prependScale(matrix:Matrix, sx:number, sy:number):void {
        matrix.set(matrix.a * sx, matrix.b * sx,
            matrix.c * sy, matrix.d * sy,
            matrix.tx, matrix.ty);
    }
    
    /** Prepends an incremental rotation to a Matrix object (angle in radians). */
    public static prependRotation(matrix:Matrix, angle:number):void {
        let sin:number = Math.sin(angle);
        let cos:number = Math.cos(angle);
    
        matrix.set(matrix.a * cos + matrix.c * sin,  matrix.b * cos + matrix.d * sin,
            matrix.c * cos - matrix.a * sin,  matrix.d * cos - matrix.b * sin,
            matrix.tx, matrix.ty);
    }
    
    /** Prepends a skew transformation to a Matrix object (angles in radians). The skew matrix
     *  has the following form:
     *  <pre>
     *  | cos(skewY)  -sin(skewX)  0 |
     *  | sin(skewY)   cos(skewX)  0 |
     *  |     0            0       1 |
     *  </pre>
     */
    public static prependSkew(matrix:Matrix, skewX:number, skewY:number):void {
        let sinX:number = Math.sin(skewX);
        let cosX:number = Math.cos(skewX);
        let sinY:number = Math.sin(skewY);
        let cosY:number = Math.cos(skewY);
    
        matrix.set(matrix.a * cosY + matrix.c * sinY,
            matrix.b * cosY + matrix.d * sinY,
            matrix.c * cosX - matrix.a * sinX,
            matrix.d * cosX - matrix.b * sinX,
            matrix.tx, matrix.ty);
    }
}