import PhysicalObject from "@/src/entities/game-objects/PhysicalObject";

export default class Spaceship extends PhysicalObject {
    constructor(position?: Vec3DTuple, size?: Vec3DTuple, rotation?: Vec3DTuple
      ) {
      super(`src/asteroids/objects/obj/spaceship.obj`, { position, size, rotation });
    }
    override updatePhysics(deltaTime: number): void {
      super.updatePhysics(deltaTime);
    
      const velocityRatio = 0.99; 
      const accelerationRatio = 0.998; 

      const speed = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2 + this.velocity.z ** 2);
      console.log(speed);
      console.log(this.acceleration);

      this.acceleration.x *= accelerationRatio;
      this.acceleration.y *= accelerationRatio;
      this.acceleration.z *= accelerationRatio;
      this.velocity.x *= velocityRatio;
      this.velocity.y *= velocityRatio;
      this.velocity.z *= velocityRatio;
    }
    
  }