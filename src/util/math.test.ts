import { Vector, Matrix, transpose } from "@/src/util/math"; // Update with the correct file path and types

describe.skip("Vector namespace", () => {
  const vec1 = { x: 1, y: 2, z: 3 };
  const vec2 = { x: 4, y: 5, z: 6 };

  test("add function", () => {
    const result = Vector.add(vec1, vec2);
    expect(result).toEqual({ x: 5, y: 7, z: 9 });
  });

  test("subtract function", () => {
    const result = Vector.subtract(vec1, vec2);
    expect(result).toEqual({ x: -3, y: -3, z: -3 });
  });

  test("multiply function", () => {
    const result = Vector.multiply(vec1, 2);
    expect(result).toEqual({ x: 2, y: 4, z: 6 });
  });

  test("divide function", () => {
    const result = Vector.divide(vec1, 2);
    expect(result).toEqual({ x: 0.5, y: 1, z: 1.5 });
  });

  test("dotP function", () => {
    const result = Vector.dotP(vec1, vec2);
    expect(result).toEqual(32); // 1*4 + 2*5 + 3*6 = 4 + 10 + 18 = 32
  });

  test("length function", () => {
    const result = Vector.length(vec1);
    expect(result).toEqual(Math.sqrt(14)); // sqrt(1^2 + 2^2 + 3^2) = sqrt(14)
  });

  test("normalize function", () => {
    const result = Vector.normalize(vec1);
    const length = Vector.length(vec1);
    expect(result).toEqual({ x: 1 / length, y: 2 / length, z: 3 / length });
  });
});

describe("Matrix namespace", () => {
  const mat1: Mat4x4 = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ];

  const vec4D = { x: 2, y: 3, z: 4, w: 1 };

  test("multiplyVector function", () => {
    const result = Matrix.multiplyVector(mat1, vec4D);
    expect(result).toEqual({ x: 66, y: 76, z: 86, w: 96 });
  });

  test("makeIDentity function", () => {
    const result = Matrix.makeIDentity();
    expect(result).toEqual([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  });

  test("makeIDentity function", () => {
    const result = Matrix.makeIDentity();
    expect(result).toEqual([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  });

  test.skip("makeRotationX function", () => {
    const angleRad = Math.PI / 4;
    const result = Matrix.makeRotationX(angleRad);
    const rotatedVec = Matrix.multiplyVector(result, { x: 1, y: 0, z: 0, w: 1 });
    expect(rotatedVec).toEqual({
      x: 1,
      y: Math.sqrt(2) / 2,
      z: Math.sqrt(2) / 2,
      w: 1,
    });
  });
});

describe("transpose function", () => {
  test("transposes a matrix", () => {
    const matrix = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    const result = transpose(matrix);
    expect(result).toEqual([
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
    ]);
  });
});
