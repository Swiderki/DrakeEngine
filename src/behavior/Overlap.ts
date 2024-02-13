import GameObject from "../entities/game-objects/GameObject";

export default class Overlap {
  readonly obj1: GameObject;
  readonly obj2: GameObject;
  enabled: boolean = true;

  constructor(obj1: GameObject, obj2: GameObject) {
    if (obj1.boxCollider == null || obj2.boxCollider == null)
      throw new Error("You need to set up a box collider for both objects first.");
    this.obj1 = obj1;
    this.obj2 = obj2;
  }

  /** It is called when overlap occurs  */
  onOverlap(): void {}

  isHappening(): boolean {
    if (!this.enabled) return false;
    const box1 = this.obj1.boxCollider!;
    const box2 = this.obj2.boxCollider!;
    const pos1 = this.obj1.position;
    const pos2 = this.obj2.position;

    const obj1AABB = [
      {
        x: Math.min(pos1.x + box1[0].x, pos1.x + box1[1].x),
        y: Math.min(pos1.y + box1[0].y, pos1.y + box1[1].y),
        z: Math.min(pos1.z + box1[0].z, pos1.z + box1[1].z),
      },
      {
        x: Math.max(pos1.x + box1[0].x, pos1.x + box1[1].x),
        y: Math.max(pos1.y + box1[0].y, pos1.y + box1[1].y),
        z: Math.max(pos1.z + box1[0].z, pos1.z + box1[1].z),
      },
    ];

    const obj2AABB = [
      {
        x: Math.min(pos2.x + box2[0].x, pos2.x + box2[1].x),
        y: Math.min(pos2.y + box2[0].y, pos2.y + box2[1].y),
        z: Math.min(pos2.z + box2[0].z, pos2.z + box2[1].z),
      },
      {
        x: Math.max(pos2.x + box2[0].x, pos2.x + box2[1].x),
        y: Math.max(pos2.y + box2[0].y, pos2.y + box2[1].y),
        z: Math.max(pos2.z + box2[0].z, pos2.z + box2[1].z),
      },
    ];

    const overlapX = obj1AABB[0].x < obj2AABB[1].x && obj1AABB[1].x > obj2AABB[0].x;
    const overlapY = obj1AABB[0].y < obj2AABB[1].y && obj1AABB[1].y > obj2AABB[0].y;
    const overlapZ = obj1AABB[0].z < obj2AABB[1].z && obj1AABB[1].z > obj2AABB[0].z;

    return overlapX && overlapY && overlapZ;
  }
}
