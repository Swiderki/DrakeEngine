import GameObject from "@/src/entities/game-objects/GameObject";

export default class Bullet extends GameObject {
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super(`src/asteroids/objects/obj/bullet.obj`, { position, size, rotation });
  }
}

