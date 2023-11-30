import { readObjFile } from "@/src/util/fs";

export default class GameObject {
  private _meshIndexed: TriangleVerteciesIndexes[] = [];
  private _vertecies: Vec3D[] = [];
  private _position: Vec3D;
  private _size: Vec3D;
  private _rotation: Rotation;

  readonly meshPath: string;

  get mesh() {
    return this._meshIndexed.map((triVerIdx) => triVerIdx.map((i) => this._vertecies[i]) as Triangle);
  }
  get vertecies() { return this._vertecies; } // prettier-ignore
  get position() { return this._position; } // prettier-ignore
  get size() { return this._size; } // prettier-ignore
  get rotation() { return this._rotation; } // prettier-ignore

  constructor(
    meshPath: string,
    position: Vec3DTuple = [0, 0, 0],
    size: Vec3DTuple = [1, 1, 1],
    rotation: Vec3DTuple = [0, 0, 0]
  ) {
    this.meshPath = meshPath;

    this._position = { x: position[0], y: position[1], z: position[2] };
    this._size = { x: size[0], y: size[1], z: size[2] };
    this._rotation = { xAxis: rotation[0], yAxis: rotation[1], zAxis: rotation[2] };
  }

  async loadMesh(): Promise<void> {
    const start = Date.now();
    console.log("starting loading mesh...");
    const { verPos, triVerIdx } = await readObjFile(this.meshPath);
    this._vertecies = verPos;
    this._meshIndexed = triVerIdx;
    console.log("applying initial position and scale...");
    // apply custom start position
    if (Object.values(this._position).some((pos) => pos !== 0)) {
      const { x, y, z } = this._position;
      this.move(x, y, z);
      this._position = { x, y, z };
    }

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
    this._position = { x: this._position.x + x, y: this._position.y + y, z: this._position.z + z };
  }

  scale(x: number, y: number, z: number) {
    for (const vertex of this._vertecies) {
      vertex.x *= x;
      vertex.y *= y;
      vertex.z *= z;
    }
    this._size = { x, y, z };
  }

  /** Rotates the cube relatively, if you need to set its absolute rotation use the `setRotation` method */
  rotate(xAxis: number, yAxis: number, zAxis: number): void {
    const originalPosition = { x: this._position.x, y: this._position.y, z: this._position.z };

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
}
