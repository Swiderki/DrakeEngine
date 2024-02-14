import { Vector } from "@/src/util/math";
import GameObject from "../GameObject";
import { Vec3DTuple } from "@/types/math";

export default class Cube extends GameObject {
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple, color?: string) {
    super("objects/cube_wire.obj", { position, size, rotation, color });
    this.boxCollider = [Vector.multiply(this.size, -1), this.size];
  }
}
