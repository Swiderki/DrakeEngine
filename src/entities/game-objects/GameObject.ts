import { Vector } from "@/src/util/math";
import { readObjFile } from "../../../src/util/fs";
import { QuaternionUtils } from "../../../src/util/quaternions";
import Camera from "../Camera";

export default class GameObject {
  private _meshIndexed: LineVerteciesIndexes[] = [];
  private _vertecies: Vec3D[] = [];

  private _position: Vec3D = { x: 0, y: 0, z: 0 };
  private _size: Vec3D = { x: 1, y: 1, z: 1 };
  private _rotation: Rotation = { xAxis: 0, yAxis: 0, zAxis: 0 };

  private _boxCollider: [Vec3D, Vec3D] | null = null;

  public showBoxcollider: Boolean = false;


  readonly meshPath: string;
  readonly allowUsingCachedMesh: boolean = true;

  get mesh() {
    return this._meshIndexed.map((triVerIdx) => triVerIdx.map((i) => this._vertecies[i]) as Line);
  }

  get vertecies() { return this._vertecies; } // prettier-ignore
  get position() { return this._position; } // prettier-ignore
  get size() { return this._size; } // prettier-ignore
  get rotation() { return this._rotation; } // prettier-ignore

  get boxColliderMesh(): Line[] | null {
    if (!this._boxCollider) {
      return null;
    }

    const [localMin, localMax] = this._boxCollider;
    const [min, max] = [Vector.add(localMin, this.position), Vector.add(localMax, this.position)];
    // console.log(localMin, min, this.position, this.size);
    // Vertices of the box with position offset
    const vertices = [
      { x: min.x, y: min.y, z: min.z }, // Vertex 0
      { x: max.x, y: min.y, z: min.z }, // Vertex 1
      { x: max.x, y: max.y, z: min.z }, // Vertex 2
      { x: min.x, y: max.y, z: min.z }, // Vertex 3
      { x: min.x, y: min.y, z: max.z }, // Vertex 4
      { x: max.x, y: min.y, z: max.z }, // Vertex 5
      { x: max.x, y: max.y, z: max.z }, // Vertex 6
      { x: min.x, y: max.y, z: max.z }, // Vertex 7
    ];

    // Edges of the box
    return [
      [vertices[0], vertices[1]],
      [vertices[1], vertices[2]],
      [vertices[2], vertices[3]],
      [vertices[3], vertices[0]], // Bottom
      [vertices[4], vertices[5]],
      [vertices[5], vertices[6]],
      [vertices[6], vertices[7]],
      [vertices[7], vertices[4]], // Top
      [vertices[0], vertices[4]],
      [vertices[1], vertices[5]],
      [vertices[2], vertices[6]],
      [vertices[3], vertices[7]], // Sides
    ];
  }

  set boxCollider(boxCollider: [Vec3D, Vec3D]) {
    this._boxCollider = boxCollider;
  }

  get boxCollider(): [Vec3D, Vec3D] | null {
    return this._boxCollider;
  }

  constructor(
    meshPath: string,
    { allowUsingCachedMesh, position, rotation, size }: GameObjectInitialConfig = {}
  ) {
    this.meshPath = meshPath;

    if (allowUsingCachedMesh) this.allowUsingCachedMesh = allowUsingCachedMesh;
    if (position) this._position = { x: position[0], y: position[1], z: position[2] };
    if (size) this._size = { x: size[0], y: size[1], z: size[2] };
    if (rotation)
      this._rotation = {
        xAxis: rotation[0],
        yAxis: rotation[1],
        zAxis: rotation[2],
      };
      this.loadMesh()
  }

  async loadMesh(): Promise<void> {
    const start = Date.now();
    // console.log("starting loading mesh...");
    const { lineVerteciesIndexes, vertexPositions } = await readObjFile(
      this.meshPath,
      this.allowUsingCachedMesh
    );

    this._vertecies = vertexPositions;
    this._meshIndexed = lineVerteciesIndexes;

    // console.log("applying initial position, scale, and rotation...");

    // Apply initial scale
    if (Object.values(this._size).some((size) => size !== 1)) {
      this.scale(this._size.x, this._size.y, this._size.z);
    }

    // Apply custom start position
    if (Object.values(this._position).some((pos) => pos !== 0)) {
      for (const vertex of this._vertecies) {
        vertex.x += this.position.x;
        vertex.y += this.position.y;
        vertex.z += this.position.z;
      }
    }

    if (Object.values(this._size).some((size) => size !== 1)) {
      const { x, y, z } = this._size;
      this.scale(x, y, z);
      this._size = { x, y, z };
    }
    /**
     * @todo scale and rotation are not being applyed
     */
    console.log(
      "finished loading mesh! loaded triangles:",
      this._meshIndexed.length,
      "time took:",
      Date.now() - start,
      "ms"
    );
  }

  /** Moves the cube relatively, if you need to move it absolutely use the `setPosition` method */
  move(x: number, y: number, z: number): void {
    for (const vertex of this._vertecies) {
      vertex.x += x;
      vertex.y += y;
      vertex.z += z;
    }

    this._position = {
      x: this._position.x + x,
      y: this._position.y + y,
      z: this._position.z + z,
    };
  }
  setPosition(x: number, y: number, z: number): void {

    for (const vertex of this._vertecies) {
      vertex.x += x - this._position.x;
      vertex.y += y - this._position.y;
      vertex.z += z - this._position.z;
    }
  
    this._position = { x, y, z };
  }
  
  scale(x: number, y: number, z: number) {
    const originalPosition = {
      x: this._position.x,
      y: this._position.y,
      z: this._position.z,
    };

    this.move(-this._position.x, -this._position.y, -this._position.z);

    for (const vertex of this._vertecies) {
      vertex.x *= x;
      vertex.y *= y;
      vertex.z *= z;
    }
    this._size = { x, y, z };

    this.move(originalPosition.x, originalPosition.y, originalPosition.z);
  }

  /** Rotates the cube relatively, if you need to set its absolute rotation use the `setRotation` method */
  rotate(xAxis: number, yAxis: number, zAxis: number): void {
    const originalPosition = {
      x: this._position.x,
      y: this._position.y,
      z: this._position.z,
    };

    this.move(-this._position.x, -this._position.y, -this._position.z);

    // Rotate X
    const cosX = Math.cos(xAxis);
    const sinX = Math.sin(xAxis);
    for (const vertex of this._vertecies) {
      const y = vertex.y * cosX - vertex.z * sinX;
      const z = vertex.y * sinX + vertex.z * cosX;
      vertex.y = y;
      vertex.z = z;
    }

    // Rotate Y
    const cosY = Math.cos(yAxis);
    const sinY = Math.sin(yAxis);
    for (const vertex of this._vertecies) {
      const x = vertex.x * cosY + vertex.z * sinY;
      const z = -vertex.x * sinY + vertex.z * cosY;
      vertex.x = x;
      vertex.z = z;
    }

    // Rotate Z
    const cosZ = Math.cos(zAxis);
    const sinZ = Math.sin(zAxis);
    for (const vertex of this._vertecies) {
      const x = vertex.x * cosZ - vertex.y * sinZ;
      const y = vertex.x * sinZ + vertex.y * cosZ;
      vertex.x = x;
      vertex.y = y;
    }

    this.move(originalPosition.x, originalPosition.y, originalPosition.z);
  }

  applyQuaternion(quaternion: QuaternionUtils.Quaternion): void {
    const originalPosition = { ...this._position };
    this.move(-this._position.x, -this._position.y, -this._position.z);

    let rotatedVertex = { x: 0, y: 0, z: 0 };

    for (const vertex of this._vertecies) {
      QuaternionUtils.rotateVector(quaternion, vertex, rotatedVertex);

      vertex.x = rotatedVertex.x;
      vertex.y = rotatedVertex.y;
      vertex.z = rotatedVertex.z;
    }

    this.move(originalPosition.x, originalPosition.y, originalPosition.z);
  }

}
