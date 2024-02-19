import { Vec3D } from "@/types/math";
import GameObject, { GameObjectInitialConfig } from "./GameObject";
import { Vector } from "@/src/util/math";

export type PhysicalObjectInitialConfig = GameObjectInitialConfig & {
  velocity?: Vec3D;
  acceleration?: Vec3D;
  mass?: number;
};

export default class PhysicalGameObject extends GameObject {
  velocity: Vec3D = { x: 0, y: 0, z: 0 };
  acceleration: Vec3D = { x: 0, y: 0, z: 0 };
  mass: number = 1;

  constructor(meshPath: string, initialConfig: PhysicalObjectInitialConfig) {
    super(meshPath, initialConfig);

    if (initialConfig.velocity) {
      this.velocity = initialConfig.velocity;
    }
    if (initialConfig.acceleration) {
      this.acceleration = initialConfig.acceleration;
    }
    if (initialConfig.mass) {
      this.mass = initialConfig.mass;
    }
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

  static createFromGameObject(
    gameObject: GameObject,
    initialConfig: PhysicalObjectInitialConfig = {}
  ): PhysicalGameObject {
    const {
      allowUsingCachedMesh = gameObject.allowUsingCachedMesh,
      position = [gameObject.position.x, gameObject.position.y, gameObject.position.z],
      rotation = [gameObject.rotation.xAxis, gameObject.rotation.yAxis, gameObject.rotation.zAxis],
      size = [gameObject.size.x, gameObject.size.y, gameObject.size.z],
      velocity,
      acceleration,
      mass,
    } = initialConfig;

    return new PhysicalGameObject(gameObject.meshPath, {
      allowUsingCachedMesh,
      position,
      rotation,
      size,
      velocity,
      acceleration,
      mass,
    });
  }
}
