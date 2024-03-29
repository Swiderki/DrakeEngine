import IDGenerator from "@/src/util/idGenerator";
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
import { Vector } from "@/src/util/math";

export type GameObjectInitialConfig = {
  position?: Vec3DTuple;
  size?: Vec3DTuple;
  rotation?: Rotation3DTuple;
  allowUsingCachedMesh?: boolean;
  color?: string;
  isHollow?: boolean;
  isShining?: boolean;
  isVisible?: boolean;
};

export default class GameObject {
  private _meshIndexed: LineVerteciesIndexesColor[] = [];
  private _vertecies: Vec3D[] = [];

  private _position: Vec3D = { x: 0, y: 0, z: 0 };
  private _size: Vec3D = { x: 1, y: 1, z: 1 };
  private _rotation: Rotation3D = { xAxis: 0, yAxis: 0, zAxis: 0 };
  color: string = "#fff";
  isHollow: boolean = false;
  isShining: boolean = false;
  isVisible: boolean = true;

  /** Represents diagonal of the cube */
  boxCollider: Line3D | null = null;
  showBoxcollider: boolean = false;
  /** If true, box collider will be updated every time this object rotates, moves etc. */
  autoupdateBoxCollider: boolean = false;
  /** Can be set to a half or sth if normal-sized boxCollider makes some issues */
  boxColliderScale: number = 1;

  readonly id: number = IDGenerator.new();

  readonly meshPath: string;
  readonly allowUsingCachedMesh: boolean = true;

  get vertecies() { return this._vertecies; } // prettier-ignore
  get position() { return this._position; } // prettier-ignore
  get size() { return this._size; } // prettier-ignore
  get rotation() { return this._rotation; } // prettier-ignore

  constructor(meshPath: string, initialConfig: GameObjectInitialConfig = {}) {
    this.meshPath = meshPath;

    if (initialConfig.allowUsingCachedMesh !== undefined) {
      this.allowUsingCachedMesh = initialConfig.allowUsingCachedMesh;
    }
    if (initialConfig.position !== undefined) {
      this._position = {
        x: initialConfig.position[0],
        y: initialConfig.position[1],
        z: initialConfig.position[2],
      };
    }
    if (initialConfig.size !== undefined) {
      this._size = { x: initialConfig.size[0], y: initialConfig.size[1], z: initialConfig.size[2] };
    }
    if (initialConfig.rotation !== undefined) {
      this._rotation = {
        xAxis: initialConfig.rotation[0],
        yAxis: initialConfig.rotation[1],
        zAxis: initialConfig.rotation[2],
      };
    }
    if (initialConfig.color !== undefined) {
      this.color = initialConfig.color;
    }
    if (initialConfig.isHollow !== undefined) {
      this.isHollow = initialConfig.isHollow;
    }
    if (initialConfig.isShining !== undefined) {
      this.isShining = initialConfig.isShining;
    }
    if (initialConfig.isVisible !== undefined) {
      this.isVisible = initialConfig.isVisible;
    }
  }

  Start(): void {}

  Update(deltaTime: number, frameNumber: number): void;
  Update(deltaTime: number): void;
  Update(): void {}

  getMesh(): Line3DColor[] {
    return this._meshIndexed.map((lineVerteciesIndexes) => ({
      line: lineVerteciesIndexes.indexes.map((i) => this._vertecies[i]) as Line3D,
      color: lineVerteciesIndexes.color ?? this.color,
    }));
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

    if (this.autoupdateBoxCollider) {
      this.generateBoxCollider();
    }
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

    const [min, max] = this.boxCollider;

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

  generateBoxCollider(): void {
    const sizes = {
      min: { x: this.vertecies[0].x, y: this.vertecies[0].y, z: this.vertecies[0].z },
      max: { x: this.vertecies[0].x, y: this.vertecies[0].y, z: this.vertecies[0].z },
    };

    for (const vert of this.vertecies) {
      sizes.min.x = Math.min(sizes.min.x, vert.x);
      sizes.min.y = Math.min(sizes.min.y, vert.y);
      sizes.min.z = Math.min(sizes.min.z, vert.z);

      sizes.max.x = Math.max(sizes.max.x, vert.x);
      sizes.max.y = Math.max(sizes.max.y, vert.y);
      sizes.max.z = Math.max(sizes.max.z, vert.z);
    }

    // some stuff to scale boxCollider, just trust me it works
    const diff = Vector.multiply(Vector.subtract(sizes.max, sizes.min), (-this.boxColliderScale + 1) * 0.5);
    const scaledBoxCollider: [Vec3D, Vec3D] = [Vector.add(sizes.min, diff), Vector.subtract(sizes.max, diff)];

    this.boxCollider = scaledBoxCollider;
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

    if (this.autoupdateBoxCollider) {
      this.generateBoxCollider();
    }
  }

  setPosition(x: number, y: number, z: number): void {
    for (const vertex of this._vertecies) {
      vertex.x += x - this._position.x;
      vertex.y += y - this._position.y;
      vertex.z += z - this._position.z;
    }

    this._position = { x, y, z };

    if (this.autoupdateBoxCollider) {
      this.generateBoxCollider();
    }
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

    if (this.autoupdateBoxCollider) {
      this.generateBoxCollider();
    }
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

    if (this.autoupdateBoxCollider) {
      this.generateBoxCollider();
    }
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

    if (this.autoupdateBoxCollider) {
      this.generateBoxCollider();
    }
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

    if (this.autoupdateBoxCollider) {
      this.generateBoxCollider();
    }
  }
}
