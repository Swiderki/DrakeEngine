import GameObject from "../entities/game-objects/GameObject";

export class Overlap {
  readonly obj1: GameObject;
  readonly obj2: GameObject;
  enabled: boolean = true;

  constructor(obj1: GameObject, obj2: GameObject) {
    this.obj1 = obj1;
    this.obj2 = obj2;
  }

  /** It is called when overlap occurs  */
  onOverlap(): void {}

  isHappening(obj1: GameObject, obj2: GameObject): boolean {
    const collideX = obj1.boxCollider[0].x <= obj2.boxCollider[1].x && obj1.boxCollider[1].x >= obj2.boxCollider[0].x;
    const collideY = obj1.boxCollider[0].y <= obj2.boxCollider[1].y && obj1.boxCollider[1].y >= obj2.boxCollider[0].y;
    const collideZ = obj1.boxCollider[0].z <= obj2.boxCollider[1].z && obj1.boxCollider[1].z >= obj2.boxCollider[0].z;

    return collideX && collideY && collideZ;
}
}