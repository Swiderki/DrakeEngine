import GameObject from "@/src/entities/game-objects/GameObject";
import PhysicalObject from "@/src/entities/game-objects/PhysicalObject";
import { QuaternionUtils } from "@/src/util/quaternions";
import { kill } from "process";

export default class Bullet extends PhysicalObject {
  rotationQuaternion: QuaternionUtils.Quaternion = { x: 0, y: 0, z: 0, w: 0}
  private lifeTime: number
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple, rotationQuaternion?: QuaternionUtils.Quaternion) {
    super(`src/asteroids/objects/obj/bullet.obj`, { position, size, rotation });
    this.rotationQuaternion.w = rotationQuaternion!.w;
    this.rotationQuaternion.x = rotationQuaternion!.x;
    this.rotationQuaternion.y = rotationQuaternion!.y;
    this.rotationQuaternion.z = rotationQuaternion!.z;
    this.lifeTime = 5;
  }
  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);
    const forwardVector = { x: 0, y: 1, z: 0 };
    const direction = { x: 0, y: 0, z: 0 };

    QuaternionUtils.rotateVector(this.rotationQuaternion, forwardVector, direction);
    const speed = 6;
    direction.x *= speed;
    direction.y *= speed;
    direction.z *= speed;
    this.move(direction.x * deltaTime, direction.y * deltaTime, direction.z * deltaTime);
    this.lifeTime -= deltaTime;
    if (this.lifeTime <= 0) {

    }
  }
}

