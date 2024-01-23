import { QuaternionUtils } from "./quaternions";
import { diff } from 'jest-diff';

describe("QuaternionUtils", () => {
    test("init", () => {
        const quaternion = { x: 0, y: 0, z: 0, w: 0 };
        QuaternionUtils.init(quaternion, 1, 2, 3, 4);
        expect(quaternion).toEqual({ x: 1, y: 2, z: 3, w: 4 });
        console.log(diff(quaternion, { x: 1, y: 2, z: 3, w: 4 }));
    });
    test("setFromAxisAngle", () => {
        const quaternion = { x: 0, y: 0, z: 0, w: 1 };
        QuaternionUtils.setFromAxisAngle(quaternion, { x: 0, y: 1, z: 0 }, Math.PI / 2);
        expect(quaternion).toEqual({ x: 0, y: 0.7071067811865475, z: 0, w: 0.7071067811865476 });
    });
    test("multiply", () => {
        const quaternion1 = { w: Math.sqrt(2) / 2, x: Math.sqrt(2) / 2, y: 0, z: 0 };
        const quaternion2 = { w: Math.sqrt(3) / 2, x: 0, y: 0.5, z: 0 };

        const quaternion = { x: 0, y: 0, z: 0, w: 0 };
        QuaternionUtils.multiply(quaternion, quaternion1, quaternion2);
        QuaternionUtils.normalize(quaternion);
        expect(quaternion).toEqual({ x: 0.6124, y: 0.3535, z: 0.3535, w: 0.6123 });
    });
    test("multiply 3 times", () => {
        const quaternion1 = { w: 0, x: 1, y: 0, z: 0 };
        const quaternion2 = { w: 0, x: 0, y: 1, z: 0 };

        let quaternion = quaternion1

        for (let i = 0; i < 3; i++) {
            let newQuaternion = { w: 0, x: 0, y: 0, z: 0 };
            QuaternionUtils.multiply(newQuaternion, quaternion, quaternion2);
            quaternion = newQuaternion;
            QuaternionUtils.normalize(quaternion);
        }

        expect(quaternion).toEqual({ w: 0, x: 0, y: 0, z: -1 });
        console.log(diff(quaternion, { w: 0, x: 0, y: 0, z: -1 }));
    });
    test("rotateVector", () => {
        const quaternion = { w: 1, x: 0, y: 0, z: 1 }; // Obrót o 90 stopni wokół osi Z
        const vector = { x: 0, y: 1, z: 0 };
        const result = { x: 0, y: 0, z: 0 };
        
        QuaternionUtils.rotateVector(quaternion, vector, result);
        expect(result).toEqual({ x: 1, y: 0, z: 0 });
    })
    
    



})
