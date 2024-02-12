type Vec2D = {
  x: number;
  y: number;
};

type Vec3D = {
  x: number;
  y: number;
  z: number;
};

/**
 * More user friendly than Vec3D, becausue it's more clear to pass array as an argument than to pass an object.
 * - Ment to be used in contructors etc.
 */
type Vec3DTuple = [number, number, number];

type Vec4D = {
  x: number;
  y: number;
  z: number;
  w: number;
};

type Rotation3D = {
  xAxis: number;
  yAxis: number;
  zAxis: number;
};
/**
 * More user friendly than Rotation3D, becausue it's more clear to pass array as an argument than to pass an object.
 * - Ment to be used in contructors etc.
 */
type Rotation3DTuple = [number, number, number];

type LineVerteciesIndexes = [number, number];

type Line3D = [Vec3D, Vec3D];

type Line4D = [Vec4D, Vec4D];

type Mat4x4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];
