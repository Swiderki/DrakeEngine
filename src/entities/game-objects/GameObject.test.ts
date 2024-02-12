// GameObject.test.ts
import GameObject from "./GameObject"; // Update with the correct file path
import { diff } from "jest-diff";

jest.mock("@/src/util/fs", () => ({
  readObjFile: jest.fn(() => ({
    lineVerteciesIndexes: [
      [0, 1],
      [1, 2],
      [2, 0],
    ] as LineVerteciesIndexes[],
    vertexPositions: [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 1, y: 1, z: 0 },
    ] as Vec3D[],
  })),
}));

describe("GameObject class", () => {
  let gameObject: GameObject;

  beforeEach(async () => {
    gameObject = await new GameObject("mockedPath");
    await gameObject.loadMesh();
  });

  test("constructor initializes object properties", () => {
    expect(gameObject.meshPath).toBe("mockedPath");
    expect(gameObject.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(gameObject.size).toEqual({ x: 1, y: 1, z: 1 });
    expect(gameObject.rotation).toEqual({ xAxis: 0, yAxis: 0, zAxis: 0 });
  });

  test("loadMesh sets vertecies and meshIndexed", async () => {
    console.log(gameObject.vertecies);
    expect(gameObject.vertecies).toHaveLength(3);
    expect(gameObject.getMesh()).toHaveLength(3);
  });

  test("move updates vertecies and position", () => {
    gameObject.move(1, 2, 3);
    expect(gameObject.vertecies).toEqual([
      { x: 1, y: 2, z: 3 },
      { x: 2, y: 2, z: 3 },
      { x: 2, y: 3, z: 3 },
    ]);
    expect(gameObject.position).toEqual({ x: 1, y: 2, z: 3 });
  });

  test.skip("scale updates vertecies and size", () => {
    gameObject.scale(2, 3, 4);

    expect(gameObject.vertecies).toEqual([
      { x: 0, y: 0, z: 0 },
      { x: 2, y: 0, z: 0 },
      { x: 2, y: 3, z: 0 },
    ]);
    expect(gameObject.size).toEqual({ x: 2, y: 3, z: 4 });
  });

  test.skip("rotate updates vertecies and rotation", () => {
    gameObject.rotate(Math.PI / 2, 0, 0);

    // After rotation around X-axis by 90 degrees, the vertices should be:
    expect(gameObject.vertecies[0]).toEqual({ x: 0, y: 0, z: 0 });
    console.log(diff(gameObject.vertecies[0], { x: 1, y: 0, z: 0 }));
    expect(gameObject.vertecies[1]).toEqual({ x: 0, y: 1, z: 0 });
    expect(gameObject.vertecies[2]).toEqual({ x: 0, y: 1, z: -1 });

    expect(gameObject.rotation).toEqual({ xAxis: Math.PI / 2, yAxis: 0, zAxis: 0 });
  });
});
