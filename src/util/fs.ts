import { transpose } from "./math";

interface parsedObj {
  verPos: Vec3D[];
  triVerIdx: TriangleVerteciesIndexes[];
}

function parseObj(text: string): parsedObj {
  // because indices are base 1 let's just fill in the 0th data
  const verPos: Vec3D[] = [];
  const triVerIdx: TriangleVerteciesIndexes[] = [];
  // const objNormals = [];

  for (const line of text.split("\n")) {
    let parts = line.split(" ");
    const dataType = parts[0];
    parts = parts.slice(1);

    switch (dataType) {
      case "v":
        const pos = parts.map(parseFloat);
        verPos.push({ x: pos[0], y: pos[1], z: pos[2] });
        break;
      // case "vn":
      //   objNormals.push(parts.map(parseFloat));
      //   break;
      case "f":
        // fPart has the form: vertexIndex/texcoords/normals
        const [vIndexes, _texcoords, _normals] = transpose(
          parts.map((fPart) => fPart.split("/").map(parseFloat))
        );
        // subtract 1 from every index because blender starts vertecies indexing from 1 not 0
        triVerIdx.push([vIndexes[0] - 1, vIndexes[1] - 1, vIndexes[2] - 1]);
        break;
      default:
        break;
    }
  }

  return { verPos, triVerIdx };
}

export async function readObjFile(path: string): Promise<parsedObj> {
  const res = await fetch(location.pathname + path);
  const text = await res.text();
  return parseObj(text);
}
