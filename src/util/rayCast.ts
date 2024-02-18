import { Line3D, Vec3D } from "..";
import { Vector } from "./math";

export function checkVectorSimilarity(v1: Vec3D, v2: Vec3D) {
    const l = Vector.dotP(Vector.normalize({...v1, y: 0}), Vector.normalize({...v2, y: 0}));
    return l;   
}

//* Math stuff, don't bother to understand
export function rayCast(origin: Vec3D, direction: Vec3D, boxCollider: Line3D): boolean {
    const minPoint = boxCollider[0];
    const maxPoint = boxCollider[1];

    let tmin = (minPoint.x - origin.x) / direction.x;
    let tmax = (maxPoint.x - origin.x) / direction.x;

    if (tmin > tmax) {
        [tmin, tmax] = [tmax, tmin];
    }

    let tymin = (minPoint.y - origin.y) / direction.y;
    let tymax = (maxPoint.y - origin.y) / direction.y;

    if (tymin > tymax) {
        [tymin, tymax] = [tymax, tymin];
    }

    if (tmin > tymax || tymin > tmax) {
        return false;
    }

    if (tymin > tmin) {
        tmin = tymin;
    }

    if (tymax < tmax) {
        tmax = tymax;
    }

    let tzmin = (minPoint.z - origin.z) / direction.z;
    let tzmax = (maxPoint.z - origin.z) / direction.z;

    if (tzmin > tzmax) {
        [tzmin, tzmax] = [tzmax, tzmin];
    }

    if (tmin > tzmax || tzmin > tmax) {
        return false;
    }

    if (tzmin > tmin) {
        tmin = tzmin;
    }

    if (tzmax < tmax) {
        tmax = tzmax;
    }

    return true;
}

