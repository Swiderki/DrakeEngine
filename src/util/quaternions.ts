import { Vector } from "./math";

export namespace QuaternionUtils {
    export type Quaternion = {
        x: number;
        y: number;
        z: number;
        w: number;
    };

    export function create(x = 0, y = 0, z = 0, w = 1): Quaternion {
        return { x, y, z, w };
    }

    export function setFromAxisAngle(axis: { x: number; y: number; z: number }, angle: number): Quaternion {
        const halfAngle = angle / 2;
        const sinHalfAngle = Math.sin(halfAngle);

        return {
            x: axis.x * sinHalfAngle,
            y: axis.y * sinHalfAngle,
            z: axis.z * sinHalfAngle,
            w: Math.cos(halfAngle)
        };
    }

    export function normalize(quaternion: Quaternion): Quaternion {
        const length = Math.sqrt(quaternion.x * quaternion.x + quaternion.y * quaternion.y + quaternion.z * quaternion.z + quaternion.w * quaternion.w);
        return {
            x: quaternion.x / length,
            y: quaternion.y / length,
            z: quaternion.z / length,
            w: quaternion.w / length
        };
    }
    export function multiply(a: Quaternion, b: Quaternion): Quaternion {
        return {
            x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
            y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
            z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
            w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z
        };
    }

    export function rotateVector(quaternion: Quaternion, vector: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
        const qVec = { x: quaternion.x, y: quaternion.y, z: quaternion.z };
        const uv = Vector.crossP(qVec, vector);
        const uuv = Vector.crossP(qVec, uv);

        uv.x *= (2.0 * quaternion.w);
        uv.y *= (2.0 * quaternion.w);
        uv.z *= (2.0 * quaternion.w);

        uuv.x *= 2.0;
        uuv.y *= 2.0;
        uuv.z *= 2.0;

        return {
            x: vector.x + uv.x + uuv.x,
            y: vector.y + uv.y + uuv.y,
            z: vector.z + uv.z + uuv.z
        };
    }

    // Możesz dodać tutaj dodatkowe funkcje dotyczące kwaternionów, jak mnożenie, obrót, itp.
}
