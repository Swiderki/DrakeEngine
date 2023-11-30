export function generateCube(
  x: number,
  y: number,
  z: number,
  xSize: number,
  ySize: number,
  zSize: number
): Triangle[] {
  return [
    // z before
    [
      { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
      { x: -xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
      { x: -xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
    ],
    [
      { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
      { x: +xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
      { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
    ],
    // z after
    [
      { x: -xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
      { x: -xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
      { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
    ],
    [
      { x: -xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
      { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
      { x: +xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
    ],
    // x before
    [
      { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
      { x: -xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
      { x: -xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
    ],
    [
      { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
      { x: -xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
      { x: -xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
    ],
    // x after
    [
      { x: +xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
      { x: +xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
      { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
    ],
    [
      { x: +xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
      { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
      { x: +xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
    ],
    // y before
    [
      { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
      { x: -xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
      { x: +xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
    ],
    [
      { x: -xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
      { x: +xSize / 2 + x, y: -ySize / 2 + y, z: +zSize / 2 + z },
      { x: +xSize / 2 + x, y: -ySize / 2 + y, z: -zSize / 2 + z },
    ],
    // y after
    [
      { x: -xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
      { x: -xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
      { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
    ],
    [
      { x: -xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
      { x: +xSize / 2 + x, y: +ySize / 2 + y, z: +zSize / 2 + z },
      { x: +xSize / 2 + x, y: +ySize / 2 + y, z: -zSize / 2 + z },
    ],
  ];
}
