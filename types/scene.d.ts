import { GameObject } from "@/src";
import { Vec2D } from "./math";

export type BackgroundObjectConfig = {
  readonly object: GameObject;
  readonly position: Vec2D;
  readonly repeat: boolean;
  /** If background should be static just set to 0 */
  readonly rotationLikeCameraSpeed: number;
};
