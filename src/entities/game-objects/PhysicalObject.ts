import GameObject from "./GameObject";
import { Vector } from "@/src/util/math";

export default class PhysicalObject extends GameObject {
  velocity: Vec3D = { x: 0, y: 0, z: 0 };
  acceleration: Vec3D = { x: 0, y: 0, z: 0 };
  mass: number;


  constructor(
    meshPath: string,
    {
      allowUsingCachedMesh,
      position,
      rotation,
      size,
      velocity = { x: 0, y: 0, z: 0 },
      acceleration = { x: 0, y: 0, z: 0 },
      mass = 1
    }: PhysicalObjectInitialConfig
  ) {
    super(meshPath, { allowUsingCachedMesh, position, rotation, size });
    this.velocity = velocity;
    this.acceleration = acceleration;
    this.mass = mass;
  }


  // Method to update the object's position based on velocity and acceleration
  updatePhysics(deltaTime: number): void {
    const deltaVelocity = Vector.multiply(this.acceleration, deltaTime);
    this.move(
      this.velocity.x * deltaTime + 0.5 * deltaVelocity.x * deltaTime,
      this.velocity.y * deltaTime + 0.5 * deltaVelocity.y * deltaTime,
      this.velocity.z * deltaTime + 0.5 * deltaVelocity.z * deltaTime
    );

    // Update velocity with the acceleration for the next frame
    this.velocity = Vector.add(this.velocity, deltaVelocity);
  }

  // Method to apply a force to the object
  applyForce(force: Vec3D): void {
    const deltaAcceleration = Vector.divide(force, this.mass); // Assuming mass is a property of GameObject
    this.acceleration = Vector.add(this.acceleration, deltaAcceleration);
  }

  static createFromGameObject(gameObject: GameObject, initialConfig?: PhysicalObjectInitialConfig): PhysicalObject {
    const {
      position = [gameObject.position.x, gameObject.position.y, gameObject.position.z],
      rotation = [gameObject.rotation.xAxis, gameObject.rotation.yAxis, gameObject.rotation.zAxis],
      size = [gameObject.size.x, gameObject.size.y, gameObject.size.z],
      velocity = { x: 0, y: 0, z: 0 },
      acceleration = { x: 0, y: 0, z: 0 },
      mass = 1
    } = initialConfig || {};

    return new PhysicalObject(gameObject.meshPath, {
      allowUsingCachedMesh: gameObject.allowUsingCachedMesh,
      position: position,
      rotation: rotation,
      size: size,
      velocity,
      acceleration,
      mass,
    });
  }
}

interface PhysicalObjectInitialConfig {
  allowUsingCachedMesh?: boolean;
  position?: Vec3DTuple;
  rotation?: Vec3DTuple;
  size?: Vec3DTuple;
  velocity?: Vec3D;
  acceleration?: Vec3D;
  mass?: number;
}
