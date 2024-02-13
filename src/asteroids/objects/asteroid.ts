import PhysicalObject from "@/src/entities/game-objects/PhysicalObject";

export default class Asteroids extends PhysicalObject {
  readonly metricalSize: string;
  constructor(asteroidNumber: number, asteroidSize: 'l' | 'm' | 's' ,position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super(`src/asteroids/objects/obj/asteroid-${asteroidSize}-${asteroidNumber}.obj`, { position, size, rotation });
    this.metricalSize = asteroidSize;
    if (asteroidSize == "s") this.boxCollider = [{x: -0.4, y: 0.4, z: 0}, {x: 0.4, y: -0.4, z: -1}];
    else if (asteroidSize == "m") this.boxCollider = [{x: -1, y: 1, z: 0}, {x: 1, y: -1, z: -1}];
    else this.boxCollider = [{x: -2, y: 2, z: 0}, {x: 2, y: -2, z: -1}];
    // this.showBoxcollider = true;
  }
}

