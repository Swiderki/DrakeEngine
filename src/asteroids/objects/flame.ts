import GameObject from "@/src/entities/game-objects/GameObject";

export default class Flame extends GameObject {
    constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
      super(`src/asteroids/objects/obj/flame.obj`, { position, size, rotation });
    }
  }