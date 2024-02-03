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
            x: roundValue(axis.x / axisLength, 5),
            y: roundValue(axis.y / axisLength, 5),
            z: roundValue(axis.z / axisLength, 5)
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
            quaternion.x /= length;
            quaternion.y /= length;
            quaternion.z /= length;
            quaternion.w /= length;
        }
    }


    // export function multiply(result: Quaternion, a: Quaternion, b: Quaternion): void {
    //     console.log(a)
    //     console.log(b)
    //     result.x = a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y
    //     result.y = a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x;
    //     result.z = a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w
    //     result.w = a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z
    // }
    export function multiply(q1: Quaternion, q2: Quaternion, result: Quaternion): void {
        const x = q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x;
        const y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y;
        const z = q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z;
        const w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w;
        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;
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

