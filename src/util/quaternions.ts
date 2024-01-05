import { Vector } from "./math";
export namespace QuaternionUtils {
    export type Quaternion = {
        x: number;
        y: number;
        z: number;
        w: number;
    };

    // Funkcja inicjalizująca kwaternion
    export function init(quaternion: Quaternion, x = 0, y = 0, z = 0, w = 1): void {
        quaternion.x = x;
        quaternion.y = y;
        quaternion.z = z;
        quaternion.w = w;
    }

    // Ustawianie kwaternionu na podstawie osi i kąta
    export function setFromAxisAngle(quaternion: Quaternion, axis: { x: number; y: number; z: number }, angle: number): void {
        const halfAngle = angle / 2;
        const sinHalfAngle = Math.sin(halfAngle);

        quaternion.x = axis.x * sinHalfAngle;
        quaternion.y = axis.y * sinHalfAngle;
        quaternion.z = axis.z * sinHalfAngle;
        quaternion.w = Math.cos(halfAngle);
    }

    // Normalizacja kwaternionu
    export function normalize(quaternion: Quaternion): void {
        const length = Math.sqrt(quaternion.x * quaternion.x + quaternion.y * quaternion.y + quaternion.z * quaternion.z + quaternion.w * quaternion.w);
        quaternion.x /= length;
        quaternion.y /= length;
        quaternion.z /= length;
        quaternion.w /= length;
    }

    // Mnożenie kwaternionów
    export function multiply(result: Quaternion, a: Quaternion, b: Quaternion): void {
        result.x = a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y;
        result.y = a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x;
        result.z = a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w;
        result.w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z;
    }

    // Obracanie wektora za pomocą kwaternionu
    export function rotateVector(quaternion: Quaternion, vector: { x: number; y: number; z: number }, result: { x: number; y: number; z: number }): void {
        const qVec = { x: quaternion.x, y: quaternion.y, z: quaternion.z };
        const uv = Vector.crossP(qVec, vector);
        const uuv = Vector.crossP(qVec, uv);

        uv.x *= (2.0 * quaternion.w);
        uv.y *= (2.0 * quaternion.w);
        uv.z *= (2.0 * quaternion.w);

        uuv.x *= 2.0;
        uuv.y *= 2.0;
        uuv.z *= 2.0;

        result.x = vector.x + uv.x + uuv.x;
        result.y = vector.y + uv.y + uuv.y;
        result.z = vector.z + uv.z + uuv.z;
    }

    // ... ewentualne dodatkowe funkcje ...
}
