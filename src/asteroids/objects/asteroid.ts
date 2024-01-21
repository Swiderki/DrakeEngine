import GameObject from "@/src/entities/game-objects/GameObject";

export default class Asteroids extends GameObject {
  constructor(asteroidNumber: number, asteroidSize: string,position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super(`src/asteroids/objects/obj/asteroid-${asteroidSize}-${asteroidNumber}.obj`, { position, size, rotation });
  }
}

