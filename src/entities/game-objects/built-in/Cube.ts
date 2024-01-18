import GameObject from "../GameObject";

export default class Cube extends GameObject {
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super("objects/cube_wire.obj", { position, size, rotation });
  }
}
