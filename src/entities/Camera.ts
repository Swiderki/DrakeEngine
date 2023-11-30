export default class Camera {
  position: Vec3D;
  lookDir: Vec3D;
  fov: number;
  /** The closest point to the Camera where drawing occurs */
  near: number;
  /** The furthest point from the Camare that drawing occurs */
  far: number;

  constructor(
    fov: number,
    near: number,
    far: number,
    position: Vec3DTuple = [0, 0, -10],
    lookDir: Vec3DTuple = [0, 0, 1]
  ) {
    this.fov = fov;
    this.near = near;
    this.far = far;

    this.position = { x: position[0], y: position[1], z: position[2] };
    this.lookDir = { x: lookDir[0], y: lookDir[1], z: lookDir[2] };
  }

  move(x: number, y: number, z: number): void {
    const { x: oldX, y: oldY, z: oldZ } = this.position;
    this.position = { x: oldX + x, y: oldY + y, z: oldZ + z };
  }
}
