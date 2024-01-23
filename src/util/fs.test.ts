// parseObj.test.ts
import { parsedObj, parseObj, readObjFile } from './fs'

global.fetch = jest.fn(() =>
  Promise.resolve({
    text: () => Promise.resolve(`
    # Blender 4.0.2
    # www.blender.org
    mtllib untitled.mtl 
    o asteroid-l-1
    v 219.0 -0.0 0
    v 97.58073580374356 -97.58073580374356 0
    v 1.3287417770748783e-14 -217.0 0
    v -93.33809511662426 -93.33809511662427 0
    v -128.0 -1.567547902908612e-14 0
    v -156.9777054234136 156.97770542341354 0
    v -2.3329521523757077e-14 127.0 0
    v 155.5634918610404 155.5634918610405 0
    s off
    l 1 2
    l 2 3
    l 3 4
    l 4 5
    l 5 6
    l 6 7
    l 7 8
    l 8 1
    `),
    headers: new Headers(),
    ok: true,
    redirected: false,
    status: 200,
    statusText: 'OK',
    url: '',
    clone: jest.fn(),
    blob: jest.fn(),
    json: jest.fn(),
    arrayBuffer: jest.fn(),
    formData: jest.fn(),
    bodyUsed: false,
    body: null as any,
    type: 'basic',
  }) as Promise<Response>
);

describe.skip('parseObj function', () => {
  test('parses  simple obj text correctly', () => {
    const objText = `
      v 1.0 2.0 3.0
      v 4.0 5.0 6.0
      v 4.0 4.0 6.0
      v 4.0 3.0 6.0
      f 1 2 3 4`;

    const expectedParsedObj: parsedObj = {
      vertexPositions: [
        { x: 1.0, y: 2.0, z: 3.0 },
        { x: 4.0, y: 5.0, z: 6.0 },
        { x: 4.0, y: 4.0, z: 6.0 },
        { x: 4.0, y: 3.0, z: 6.0 },
      ],
      lineVerteciesIndexes: [[0, 1], [1, 2], [2, 3], [3, 0]],
    };
    console.time('parseObj');
    const result = parseObj(objText);
    console.timeEnd('parseObj');
    // console.log(result);
    expect(result).toEqual(expectedParsedObj);
  });

});

describe('parseObj function', () => {
  test('parses complex object text more ', () => {
    const objText = `
    # Blender 4.0.2
    # www.blender.org
    mtllib untitled.mtl 
    o asteroid-l-1
    v 219.0 -0.0 0
    v 97.58073580374356 -97.58073580374356 0
    v 1.3287417770748783e-14 -217.0 0
    v -93.33809511662426 -93.33809511662427 0
    v -128.0 -1.567547902908612e-14 0
    v -156.9777054234136 156.97770542341354 0
    v -2.3329521523757077e-14 127.0 0
    v 155.5634918610404 155.5634918610405 0
    s off
    l 1 2
    l 2 3
    l 3 4
    l 4 5
    l 5 6
    l 6 7
    l 7 8
    l 8 1`;

    const expectedParsedObj: parsedObj = {
      vertexPositions: [
        { x: 219.0, y: -0.0, z: 0 },
        { x: 97.58073580374356, y: -97.58073580374356, z: 0 },
        { x: 1.3287417770748783e-14, y: -217.0, z: 0 },
        { x: -93.33809511662426, y: -93.33809511662427, z: 0 },
        { x: -128.0, y: -1.567547902908612e-14, z: 0 },
        { x: -156.9777054234136, y: 156.97770542341354, z: 0 },
        { x: -2.3329521523757077e-14, y: 127.0, z: 0 },
        { x: 155.5634918610404, y: 155.5634918610405, z: 0 },
      ],
      lineVerteciesIndexes: [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [4, 5], [5, 6], [6, 7], [7, 0]
      ],
    };
    console.time('parseObj');
    const result = parseObj(objText);
    console.timeEnd('parseObj');
    // console.log(result);
    expect(result).toEqual(expectedParsedObj);
  });

});

describe.skip('parseObj function', () => {
  test('load obj from file', async () => {
    const parsedObj = await readObjFile('../asteroids/objects/obj/asteroid-l-1.obj', false)

    const expectedParsedObj: parsedObj = {
      vertexPositions: [
        { x: 219.0, y: -0.0, z: 0 },
        { x: 97.58073580374356, y: -97.58073580374356, z: 0 },
        { x: 1.3287417770748783e-14, y: -217.0, z: 0 },
        { x: -93.33809511662426, y: -93.33809511662427, z: 0 },
        { x: -128.0, y: -1.567547902908612e-14, z: 0 },
        { x: -156.9777054234136, y: 156.97770542341354, z: 0 },
        { x: -2.3329521523757077e-14, y: 127.0, z: 0 },
        { x: 155.5634918610404, y: 155.5634918610405, z: 0 },
      ],
      lineVerteciesIndexes: [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [4, 5], [5, 6], [6, 7], [7, 0]
      ],
    };
    console.time('parseObj');
    console.timeEnd('parseObj');
    // console.log(result);
    expect(parsedObj).toEqual(expectedParsedObj);
  });

});
