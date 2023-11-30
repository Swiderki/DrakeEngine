import GameObject from "../GameObject";

export default class Sphere extends GameObject {
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super("objects/sphere.obj", position, size, rotation);
  }
}
