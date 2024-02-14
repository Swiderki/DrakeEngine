import IDGenerator from "@/src/util/idGenerator";
import { Vector } from "@/src/util/math";
import { readObjFile } from "@/src/util/fs";
import { QuaternionUtils } from "@/src/util/quaternions";
import {
  Line3D,
  Line3DColor,
  LineVerteciesIndexesColor,
  Rotation3D,
  Rotation3DTuple,
  Vec3D,
  Vec3DTuple,
} from "@/types/math";

export type GameObjectInitialConfig = {
  position?: Vec3DTuple;
  size?: Vec3DTuple;
  rotation?: Rotation3DTuple;
  allowUsingCachedMesh?: boolean;
  color?: string;
};

export default class GameObject {
  private _meshIndexed: LineVerteciesIndexesColor[] = [];
  private _vertecies: Vec3D[] = [];

  private _position: Vec3D = { x: 0, y: 0, z: 0 };
  private _size: Vec3D = { x: 1, y: 1, z: 1 };
  private _rotation: Rotation3D = { xAxis: 0, yAxis: 0, zAxis: 0 };
  color: string = "#fff";

  // represents diagonal of the cube
  boxCollider: Line3D | null = null;
  showBoxcollider: boolean = false;
  public killed: Boolean = false;

  readonly id: number = IDGenerator.new();

  readonly meshPath: string;
  readonly allowUsingCachedMesh: boolean = true;

  get vertecies() { return this._vertecies; } // prettier-ignore
  get position() { return this._position; } // prettier-ignore
  get size() { return this._size; } // prettier-ignore
  get rotation() { return this._rotation; } // prettier-ignore

  constructor(meshPath: string, initialConfig: GameObjectInitialConfig = {}) {
    this.meshPath = meshPath;

    if (initialConfig.allowUsingCachedMesh) {
      this.allowUsingCachedMesh = initialConfig.allowUsingCachedMesh;
    }
    if (initialConfig.position) {
      this._position = {
        x: initialConfig.position[0],
        y: initialConfig.position[1],
        z: initialConfig.position[2],
      };
    }
    if (initialConfig.size) {
      this._size = { x: initialConfig.size[0], y: initialConfig.size[1], z: initialConfig.size[2] };
    }
    if (initialConfig.rotation) {
      this._rotation = {
        xAxis: initialConfig.rotation[0],
        yAxis: initialConfig.rotation[1],
        zAxis: initialConfig.rotation[2],
      };
    }
    if (initialConfig.color) {
      this.color = initialConfig.color;
    }
  }

  Start(): void {}

  Update(deltaTime: number): void;
  Update(): void {}

  getMesh(): Line3DColor[] {
    return this._meshIndexed.map((lineVerteciesIndexes) => ({
      line: lineVerteciesIndexes.indexes.map((i) => this._vertecies[i]) as Line3D,
      color: lineVerteciesIndexes.color ?? this.color,
    }));
  }

  setLineColor(lineIndex: number, color: string): void {
    if (!this._meshIndexed[lineIndex]) {
      throw new Error("Line index out of range: " + lineIndex);
    }
    this._meshIndexed[lineIndex].color = color;
  }

  getBoxColliderMesh(): Line3D[] | null {
    if (!this.boxCollider) {
      return null;
    }

    const [localMin, localMax] = this.boxCollider;
    const [min, max] = [Vector.add(localMin, this.position), Vector.add(localMax, this.position)];
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

  async loadMesh(): Promise<void> {
    const { lineVerteciesIndexes, vertexPositions } = await readObjFile(
      this.meshPath,
      this.allowUsingCachedMesh
    );
    this._vertecies = vertexPositions;
    this._meshIndexed = lineVerteciesIndexes.map((lineIndexes) => ({
      indexes: lineIndexes,
      color: null, // color will be taken from this.color property
    }));

    this.applyInitialParams();

    /**
     * @todo  rotation is not being applyed
     */
  }

  applyInitialParams() {
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
  }

  /** Moves the GameObject relatively, if you need to move it absolutely use the `setPosition` method instead */
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

  /** Scales the GameObject relatively, if you need to set its absolute scale use the `setScale` method instead */
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

  setScale(x: number, y: number, z: number) {
    const originalPosition = {
      x: this._position.x,
      y: this._position.y,
      z: this._position.z,
    };

    this.move(-this._position.x, -this._position.y, -this._position.z);

    for (const vertex of this._vertecies) {
      vertex.x *= (1 / this.size.x) * x;
      vertex.y *= (1 / this.size.y) * y;
      vertex.z *= (1 / this.size.z) * z;
    }
    this._size = { x, y, z };

    this.move(originalPosition.x, originalPosition.y, originalPosition.z);
  }

  /** Rotates the GameObject relatively, if you need to set its absolute rotation use the `setRotation` method instead */
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

    const rotatedVertex = { x: 0, y: 0, z: 0 };

    for (const vertex of this._vertecies) {
      QuaternionUtils.rotateVector(quaternion, vertex, rotatedVertex);

      vertex.x = rotatedVertex.x;
      vertex.y = rotatedVertex.y;
      vertex.z = rotatedVertex.z;
    }

    this.move(originalPosition.x, originalPosition.y, originalPosition.z);
  }

  kill() {
    this.killed = true;
  }
}
