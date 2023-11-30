interface Vec3D {
  x: number;
  y: number;
  z: number;
}

interface Vec4D {
  x: number;
  y: number;
  z: number;
  w: number;
}

type Vec3DTuple = [number, number, number];

interface Rotation {
  xAxis: number;
  yAxis: number;
  zAxis: number;
}

type TriangleVerteciesIndexes = [number, number, number];

type Triangle = [Vec3D, Vec3D, Vec3D];

type Triangle4D = [Vec4D, Vec4D, Vec4D];

interface GameObject {
  position: Vec3D;
  size: Vec3D;
  rotation: Rotation;
  vertecies: Vec3D[];
  mesh: Triangle[];
  loadMesh(): Promise<void>;
}

type Mat4x4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];
