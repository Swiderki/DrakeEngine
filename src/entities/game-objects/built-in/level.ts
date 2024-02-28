import PhysicalGameObject from "../PhysicalGameObject";
import { Vec3DTuple } from "@/types/math";

export default class Level extends PhysicalGameObject {
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple, color?: string) {
    super("objects/level5.obj", { position, size, rotation, color });
  }
}
