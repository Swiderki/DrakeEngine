import GameObject from "@/src/entities/game-objects/GameObject";
import PhysicalObject from "@/src/entities/game-objects/PhysicalObject";

export default class Bullet extends PhysicalObject {
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super(`src/asteroids/objects/obj/bullet.obj`, { position, size, rotation });
  }
  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);
  }
}

