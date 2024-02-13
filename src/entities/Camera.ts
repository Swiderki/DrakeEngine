import { Vec3D, Vec3DTuple } from "@/types/math";
import { QuaternionUtils } from "../util/quaternions";

export default class Camera {
  position: Vec3D = { x: 0, y: 0, z: -10 };
  lookDir: Vec3D = { x: 0, y: 0, z: 1 };
  fov: number;
  /** The closest point to the Camera where drawing occurs */
  near: number;
  /** The furthest point from the Camare that drawing occurs */
  far: number;
  rotationQuaternion: QuaternionUtils.Quaternion = { x: 0, y: 0, z: 0, w: 0 };

  constructor(fov: number, near: number, far: number, position?: Vec3DTuple, lookDir?: Vec3DTuple) {
    this.fov = fov;
    this.near = near;
    this.far = far;

    if (position) {
      this.position = { x: position[0], y: position[1], z: position[2] };
    }
    if (lookDir) {
      this.lookDir = { x: lookDir[0], y: lookDir[1], z: lookDir[2] };
    }
  }

  move(x: number, y: number, z: number): void {
    const { x: oldX, y: oldY, z: oldZ } = this.position;
    this.position = { x: oldX + x, y: oldY + y, z: oldZ + z };
  }

  rotate(axis: { x: number; y: number; z: number }, amount: number): void {
    QuaternionUtils.setFromAxisAngle(this.rotationQuaternion, axis, amount);

    QuaternionUtils.normalize(this.rotationQuaternion);
    QuaternionUtils.rotateVector(this.rotationQuaternion, { ...this.lookDir }, this.lookDir);
  }
}
