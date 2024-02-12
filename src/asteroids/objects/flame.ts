import PhysicalGameObject from "@/src/entities/game-objects/PhysicalGameObject";

export default class Flame extends PhysicalGameObject {
  canvasWidth: number = 11;
  canvasHeight: number = 6;
  constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple) {
    super(`src/asteroids/objects/obj/flame.obj`, { position, size, rotation });
  }
  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);

    const velocityRatio = 0.99;
    const accelerationRatio = 0.998;

    this.acceleration.x *= accelerationRatio;
    this.acceleration.y *= accelerationRatio;
    this.acceleration.z *= accelerationRatio;
    this.velocity.x *= velocityRatio;
    this.velocity.y *= velocityRatio;
    this.velocity.z *= velocityRatio;
    this.checkPosition();
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
