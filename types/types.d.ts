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

type LineVerteciesIndexes = [number, number];

type Line = [Vec3D, Vec3D];

type Line4D = [Vec4D, Vec4D];


interface GameObject {
  position: Vec3D;
  size: Vec3D;
  rotation: Rotation;
  vertecies: Vec3D[];
  mesh: Line[];
  loadMesh(): Promise<void>;
  showBoxcollider: Boolean;
  killed: Boolean;
  boxColliderMesh: Line[] | null;
}

type GameObjectInitialConfig = {
  position?: Vec3DTuple;
  size?: Vec3DTuple;
  rotation?: Vec3DTuple;
  allowUsingCachedMesh?: boolean;
};

type Mat4x4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];
