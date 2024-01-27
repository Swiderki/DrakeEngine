import GameObject from "@/src/entities/game-objects/GameObject";
import PhysicalObject from "@/src/entities/game-objects/PhysicalObject";

export default class Asteroids extends PhysicalObject {
  constructor(asteroidNumber: number, asteroidSize: string,position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super(`src/asteroids/objects/obj/asteroid-${asteroidSize}-${asteroidNumber}.obj`, { position, size, rotation });
    if (asteroidSize == "s") this.boxCollider = [{x: -40, y: 40, z: 0}, {x: 40, y: -40, z: 40}];
    else if (asteroidSize == "m") this.boxCollider = [{x: -100, y: 100, z: 0}, {x: 100, y: -100, z: 40}];
    else this.boxCollider = [{x: -200, y: 200, z: 0}, {x: 200, y: -200, z: 40}];
  }
}

