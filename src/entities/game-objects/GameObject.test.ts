import GameObject from "./GameObject";
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();  
test("move() should move the vertices correctly", () => {
    const cube = new GameObject("cube.obj", [1, 2, 3], [4, 5, 6], [7, 8, 9]);
    cube.loadMesh();
  
    cube.move(10, 20, 30);
  
    expect(cube.vertecies).toEqual([
      { x: 11, y: 22, z: 33 },
      { x: 15, y: 27, z: 39 },
      { x: 19, y: 31, z: 43 },
      { x: 23, y: 35, z: 47 },
      { x: 27, y: 39, z: 51 },
      { x: 31, y: 43, z: 55 },
    ]);
  });
  
  test("scale() should scale the vertices correctly", () => {
    const cube = new GameObject("cube.obj", [1, 2, 3], [4, 5, 6], [7, 8, 9]);
    cube.loadMesh();
  
    cube.scale(2, 3, 4);
  
    expect(cube.vertecies).toEqual([
      { x: 2, y: 6, z: 12 },
      { x: 8, y: 15, z: 24 },
      { x: 14, y: 21, z: 36 },
      { x: 20, y: 30, z: 48 },
      { x: 26, y: 39, z: 60 },
      { x: 32, y: 48, z: 72 },
    ]);
  });
  
  test("rotate() should rotate the vertices correctly", () => {
    const cube = new GameObject("cube.obj", [1, 2, 3], [4, 5, 6], [7, 8, 9]);
    cube.loadMesh();
  
    cube.rotate(Math.PI / 2, Math.PI, Math.PI / 3);
  
    expect(cube.vertecies).toEqual([
      { x: 3, y: 1, z: -2 },
      { x: 3, y: 5, z: -1 },
      { x: 1, y: 9, z: 0 },
      { x: -2, y: 13, z: 1 },
      { x: -6, y: 17, z: 2 },
      { x: -10, y: 21, z: 3 },
    ]);
  });