import GameObject from "@/src/entities/game-objects/GameObject";

export default class Asteroid extends GameObject {
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super("./obj/asteroid-l-1.obj", { position, size, rotation });
  }
}
