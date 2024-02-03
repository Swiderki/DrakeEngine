import GameObject from "@/src/entities/game-objects/GameObject";

export default class Ufo extends GameObject {
    constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
      super(`src/asteroids/objects/obj/ufo.obj`, { position, size, rotation });
    }
  }