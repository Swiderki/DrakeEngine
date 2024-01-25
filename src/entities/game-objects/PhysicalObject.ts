import GameObject from "./GameObject";

interface PhysicsState {
    velocity: [Vec3D, number]; // [direccion, magnitude]
    acceleration: [Vec3D, number];
    mass: number;
}

export default class PhysicalObject extends GameObject {
  private _velocity: [Vec3D, number];
  private _acceleration: [Vec3D, number];
  private _mass: number;

  constructor(
    meshPath: string,
    config?: GameObjectInitialConfig,
    physicsConfig?: PhysicsState
  ) {
    super(meshPath, config);
    this._velocity = physicsConfig?.velocity || [{ x: 0, y: 0, z: 0 }, 0];
    this._acceleration = physicsConfig?.acceleration || [
      { x: 0, y: 0, z: 0 },
      0,
    ];
    this._mass = physicsConfig?.mass || 1;
  }

  get velocity(): [Vec3D, number] {
    return this._velocity;
  }

  set velocity(value: [Vec3D, number]) {
    this._velocity = value;
  }

  get acceleration(): [Vec3D, number] {
    return this._acceleration;
  }

  set acceleration(value: [Vec3D, number]) {
    this._acceleration = value;
  }

  get mass(): number {
    return this._mass;
  }

  set mass(value: number) {
    this._mass = value;
  }

  applyForce(force: Vec3D): void {
    // F = m * a  =>  a = F / m
    const scaledForce = {
      x: force.x / this.mass,
      y: force.y / this.mass,
      z: force.z / this.mass,
    };
    this.acceleration = [
      {
        x: this.acceleration[0].x + scaledForce.x,
        y: this.acceleration[0].y + scaledForce.y,
        z: this.acceleration[0].z + scaledForce.z,
      },
      this.acceleration[1],
    ];
  }

  updatePhysics(deltaTime: number): void {
    // Update velocity based on acceleration: v = u + at
    this.velocity[0].x += this.acceleration[0].x * deltaTime;
    this.velocity[0].y += this.acceleration[0].y * deltaTime;
    this.velocity[0].z += this.acceleration[0].z * deltaTime;

    // Normalize the velocity vector
    const velocityMagnitude = Math.sqrt(
      this.velocity[0].x ** 2 +
        this.velocity[0].y ** 2 +
        this.velocity[0].z ** 2
    );
    
    this.velocity[0] = {
      x: this.velocity[0].x / velocityMagnitude,
      y: this.velocity[0].y / velocityMagnitude,
      z: this.velocity[0].z / velocityMagnitude,
    };

    // Scale the velocity vector
    this.velocity[0] = {
      x: this.velocity[0].x * this.velocity[1],
      y: this.velocity[0].y * this.velocity[1],
      z: this.velocity[0].z * this.velocity[1],
    };

    // Update position based on scaled velocity: s = vt
    const displacement = {
      x: this.velocity[0].x * deltaTime,
      y: this.velocity[0].y * deltaTime,
      z: this.velocity[0].z * deltaTime,
    };

    this.move(displacement.x, displacement.y, displacement.z);
  }
}
