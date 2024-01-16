import GameObject from "../GameObject";

export default class Piramide extends GameObject {
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super("objects/piramide.obj", { position, size, rotation });
  }
}
