// parseObj.test.ts
import { parsedObj, parseObj } from './fs'

describe('parseObj function', () => {
  test('parses obj text correctly', () => {
    const objText = `
      v 1.0 2.0 3.0
      v 4.0 5.0 6.0
      f 1 2
    `;

    const expectedParsedObj: parsedObj = {
      vertexPositions: [
        { x: 1.0, y: 2.0, z: 3.0 },
        { x: 4.0, y: 5.0, z: 6.0 },
      ],
      lineVerteciesIndexes: [[0, 1]],
    };

    const result = parseObj(objText);

    expect(result).toEqual(expectedParsedObj);
  });

});
