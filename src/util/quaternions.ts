export namespace QuaternionUtils {
    export type Quaternion = {
        x: number;
        y: number;
        z: number;
        w: number;
    };

    function roundValue(value: number, decimals: number): number {
        return parseFloat(value.toFixed(decimals));
    }

    export function init(quaternion: Quaternion, x = 0, y = 0, z = 0, w = 1): void {
        quaternion.x = roundValue(x, 4);
        quaternion.y = roundValue(y, 4);
        quaternion.z = roundValue(z, 4);
        quaternion.w = roundValue(w, 4);
    }

    export function setFromAxisAngle(quaternion: Quaternion, axis: { x: number; y: number; z: number }, angle: number): void {
        // Normalize the axis
        let axisLength = Math.sqrt(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z);
        let normalizedAxis = {
            x: roundValue(axis.x / axisLength, 4),
            y: roundValue(axis.y / axisLength, 4),
            z: roundValue(axis.z / axisLength, 4)
        };

        const halfAngle = angle / 2;
        const sinHalfAngle = Math.sin(halfAngle);

        quaternion.x = roundValue(normalizedAxis.x * sinHalfAngle, 4);
        quaternion.y = roundValue(normalizedAxis.y * sinHalfAngle, 4);
        quaternion.z = roundValue(normalizedAxis.z * sinHalfAngle, 4);
        quaternion.w = roundValue(Math.cos(halfAngle), 4);
    }

    export function normalize(quaternion: Quaternion): void {
        const length = Math.sqrt(quaternion.x * quaternion.x + quaternion.y * quaternion.y + quaternion.z * quaternion.z + quaternion.w * quaternion.w);

        if (length < Number.EPSILON) {
            quaternion.x = 0;
            quaternion.y = 0;
            quaternion.z = 0;
            quaternion.w = 1;
        } else {
            quaternion.x = roundValue(quaternion.x / length, 4);
            quaternion.y = roundValue(quaternion.y / length, 4);
            quaternion.z = roundValue(quaternion.z / length, 4);
            quaternion.w = roundValue(quaternion.w / length, 4);
        }
    }

    export function multiply(result: Quaternion, a: Quaternion, b: Quaternion): void {
        result.x = roundValue(a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y, 4);
        result.y = roundValue(a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x, 4);
        result.z = roundValue(a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w, 4);
        result.w = roundValue(a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z, 4);
    }

    export function rotateVector(quaternion: Quaternion, vector: { x: number; y: number; z: number }, result: { x: number; y: number; z: number }): void {
        const q = quaternion;
        const ix = q.w * vector.x + q.y * vector.z - q.z * vector.y;
        const iy = q.w * vector.y + q.z * vector.x - q.x * vector.z;
        const iz = q.w * vector.z + q.x * vector.y - q.y * vector.x;
        const iw = -q.x * vector.x - q.y * vector.y - q.z * vector.z;

        result.x = ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y;
        result.y = iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z;
        result.z = iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x;
    }

}
