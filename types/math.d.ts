export type Vec2D = {
  x: number;
  y: number;
};

export type Vec3D = {
  x: number;
  y: number;
  z: number;
};

/**
 * More user friendly than Vec3D, becausue it's more clear to pass array as an argument than to pass an object.
 * - Ment to be used in contructors etc.
 */
export type Vec3DTuple = [number, number, number];

export type Vec4D = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export type Rotation3D = {
  xAxis: number;
  yAxis: number;
  zAxis: number;
};
/**
 * More user friendly than Rotation3D, becausue it's more clear to pass array as an argument than to pass an object.
 * - Ment to be used in contructors etc.
 */
export type Rotation3DTuple = [number, number, number];

export type LineVerteciesIndexes = [number, number];

/**
 * When color is set to null, all the lines will be colored in GameObject.color value
 */
export type LineVerteciesIndexesColor = { indexes: LineVerteciesIndexes; color: string | null };

export type Line3D = [Vec3D, Vec3D];

export type Line3DColor = { line: Line3D; color: string };

export type Line4D = [Vec4D, Vec4D];

export type Mat4x4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];

export type Plane = {
  normal: Vec3D;
  point: Vec3D;
};

export type Frustum = Plane[];
