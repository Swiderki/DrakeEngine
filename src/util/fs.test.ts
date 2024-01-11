// parseObj.test.ts
import { parsedObj, parseObj } from './fs'

describe('parseObj function', () => {
  test('parses obj text correctly', () => {
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
