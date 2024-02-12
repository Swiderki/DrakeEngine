export interface parsedObj {
  vertexPositions: Vec3D[];
  lineVerteciesIndexes: LineVerteciesIndexes[];
}

/**
 * @todo at this moment edges are read separately
 * for each face, so they can be duplicated if edge
 * is belongs to two faces at the same time, in the
 * future a duplication avoider should be
 * implmented
 */
export function parseObj(text: string): parsedObj {
  const vertexPositions: Vec3D[] = [];
  const lineVerteciesIndexes: LineVerteciesIndexes[] = [];

  for (const line of text.trim().split("\n")) {
    let parts = line.trim().split(" ");
    const dataType = parts[0].trim();
    parts = parts.slice(1);

    switch (dataType) {
      case "v":
        const pos = parts.map(parseFloat);
        vertexPositions.push({ x: pos[0], y: pos[1], z: pos[2] });
        break;

      case "l":
        // subtract 1 from every index because blender starts vertecies indexing from 1 not 0
        lineVerteciesIndexes.push([parseFloat(parts[0]) - 1, parseFloat(parts[1]) - 1]);
        break;

      case "f":
        const vertexIndexes = parts.map(parseFloat);
        for (let i = 0; i < parts.length; i++) {
          // subtract 1 from every index because blender starts vertecies indexing from 1 not 0
          lineVerteciesIndexes.push([vertexIndexes[i] - 1, vertexIndexes[(i + 1) % parts.length] - 1]);
        }
        break;
    }
  }

  return { vertexPositions, lineVerteciesIndexes };
}

const cachedObjects = new Map<string, Promise<parsedObj>>();

export async function readObjFile(path: string, allowUsingCachedMesh: boolean): Promise<parsedObj> {
  if (allowUsingCachedMesh && cachedObjects.get(path)) return structuredClone(await cachedObjects.get(path)!);

  cachedObjects.set(
    path,
    (async () => {
      // console.log(location.pathname + path)
      const res = await fetch(location.pathname + path);
      const text = await res.text();
      return parseObj(text);
    })()
  );

  return structuredClone(await cachedObjects.get(path)!);
}
