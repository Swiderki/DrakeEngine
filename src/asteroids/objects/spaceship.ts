import PhysicalObject from "@/src/entities/game-objects/PhysicalObject";

export default class Spaceship extends PhysicalObject {
  canvasWidth: number = 11;
  canvasHeight: number = 6;
  maxVelocity: number = 5; // Maksymalna prędkość statku

  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super(`src/asteroids/objects/obj/spaceship.obj`, { position, size, rotation });
  }

  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);

    // Zastosowanie tłumienia
    const velocityRatio = 0.9983;
    const accelerationRatio = 0.995;

    this.acceleration.x *= accelerationRatio;
    this.acceleration.y *= accelerationRatio;
    this.acceleration.z *= accelerationRatio;

    this.velocity.x *= velocityRatio;
    this.velocity.y *= velocityRatio;
    this.velocity.z *= velocityRatio;

    // Ograniczenie maksymalnej prędkości
    this.limitVelocity();

    // Sprawdzenie i ewentualna korekta pozycji statku
    this.checkPosition();
  }

  limitVelocity(): void {
    const currentVelocityMagnitude = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2 + this.velocity.z ** 2);
    if (currentVelocityMagnitude > this.maxVelocity) {
      const reductionFactor = this.maxVelocity / currentVelocityMagnitude;
      this.velocity.x *= reductionFactor;
      this.velocity.y *= reductionFactor;
      this.velocity.z *= reductionFactor;
    }
  }

  checkPosition(): void {
    let deltaX = 0;
    let deltaY = 0;

    if (this.position.x > this.canvasWidth) {
      deltaX = -(this.canvasWidth * 2);
    } else if (this.position.x < -this.canvasWidth) {
      deltaX = this.canvasWidth * 2;
    }

    if (this.position.y > this.canvasHeight) {
      deltaY = -(this.canvasHeight * 2);
    } else if (this.position.y < -this.canvasHeight) {
      deltaY = this.canvasHeight * 2;
    }

    if (deltaX != 0 || deltaY != 0) {
      this.move(deltaX, deltaY, 0);
    }
  }
}
