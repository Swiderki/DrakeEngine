import GameObject from "@/src/entities/game-objects/GameObject";
import PhysicalObject from "@/src/entities/game-objects/PhysicalObject";

export default class Asteroids extends PhysicalObject {
  constructor(asteroidNumber: number, asteroidSize: string,position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super(`src/asteroids/objects/obj/asteroid-${asteroidSize}-${asteroidNumber}.obj`, { position, size, rotation });
  }
}

