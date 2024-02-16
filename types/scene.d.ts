import { Vec2D } from "./math";

type ImageConfig = {
  src: string;
  position: Vec2D;
  repeat: boolean;
  /** If background should be static just set to 0 */
  rotationLikeCameraSpeed: number;
};

type StaticImageConfig = {
  type: "static";
};

type AnimatedImageConfig = {
  type: "animated";
  frameWidth: number;
  speed: number;
};

export type BackgroundImageConfig = ImageConfig & (StaticImageConfig | AnimatedImageConfig);
