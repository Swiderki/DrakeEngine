import { Vector } from "@/src/util/math";
import GameObject from "../GameObject";

export default class Cube extends GameObject {
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super("objects/cube_wire.obj", { position, size, rotation });
    this.boxCollider = [Vector.multiply(this.size, -1), this.size];
  }
}
