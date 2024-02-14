import { Vec3DTuple } from "@/types/math";
import GameObject from "../GameObject";

export default class Piramide extends GameObject {
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple, color?: string) {
    super("objects/piramide.obj", { position, size, rotation, color });
  }
}
