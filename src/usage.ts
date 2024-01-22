import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";
import { QuaternionUtils } from "@/src/util/quaternions";
import Asteroid from "./asteroids/objects/asteroid";
import Spaceship from "./asteroids/objects/spaceship";
import { dir } from "console";
const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");


function testRotation(axis: any, angle: any, expectedVector: any) {
  let quaternion = { x: 0, y: 0, z: 0, w: 1 };
  QuaternionUtils.setFromAxisAngle(quaternion, axis, angle);

  let vector = { x: 0, y: 1, z: 0 };
  let rotatedVector = { x: 0, y: 0, z: 0 };

  QuaternionUtils.rotateVector(quaternion, vector, rotatedVector);

  console.log(`Test: Obrót wokół osi [${axis.x}, ${axis.y}, ${axis.z}] o kąt ${angle} radianów`);
  console.log("Oczekiwany wynik:", JSON.stringify(expectedVector));
  console.log(`Wynik obrotu: [${rotatedVector.x.toFixed(2)}, ${rotatedVector.y.toFixed(2)}, ${rotatedVector.z.toFixed(2)}]`);
  console.log('---');
}

function runTests() {
  // Test 1: Obrót o 90 stopni wokół osi Z (powinno dać [1, 0, 0])
  testRotation({ x: 0, y: 0, z: 1 }, Math.PI / 2, { x: 1, y: 0, z: 0 });

  // Test 2: Obrót o -90 stopni wokół osi Z (powinno dać [-1, 0, 0])
  testRotation({ x: 0, y: 0, z: 1 }, -Math.PI / 2, { x: -1, y: 0, z: 0 });

  // Test 3: Obrót o 180 stopni wokół osi Y (powinno dać [0, -1, 0])
  testRotation({ x: 0, y: 1, z: 0 }, Math.PI, { x: 0, y: -1, z: 0 });

  // Test 4: Obrót o 90 stopni wokół osi X (powinno dać [0, 0, -1])
  testRotation({ x: 1, y: 0, z: 0 }, Math.PI / 2, { x: 0, y: 0, z: -1 });
}

runTests();

class MyGame extends Drake.Engine {
  cubes: Cube[] = [];
  spaceship;


  constructor(canvas: HTMLCanvasElement) {
    const camera = new Drake.Camera(69, 0.1, 1000, [0, 0, -10], [0, 0, 1]);
    super(canvas, camera);

    this.cubes.forEach((cube) => this.addSceneMesh(cube));
    this.spaceship = {obj: new Spaceship([0, 0, 0], [0.01, 0.01, 0.01]), rotation: {x: 0,y: 0, z: 0, w: 1} };

    this.addSceneMesh(this.spaceship.obj);
  }

  handleSpaceshipMove(e: KeyboardEvent) {
    const rotationAmount = Math.PI / 16; // Kąt obrotu
  
    if (e.key === "a") {
      // Obrót w lewo
      const rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };
      QuaternionUtils.setFromAxisAngle(rotationQuaternion, { x: 0, y: 0, z: 1 }, rotationAmount);
      QuaternionUtils.normalize(rotationQuaternion);
      this.spaceship.obj.applyQuaternion(rotationQuaternion);
      QuaternionUtils.multiply(this.spaceship.rotation, rotationQuaternion, this.spaceship.rotation);
    } else if (e.key === "d") {
      // Obrót w prawo
      const rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };
      QuaternionUtils.setFromAxisAngle(rotationQuaternion, { x: 0, y: 0, z: -1 }, rotationAmount);
      QuaternionUtils.normalize(rotationQuaternion);
      this.spaceship.obj.applyQuaternion(rotationQuaternion);

      QuaternionUtils.multiply(this.spaceship.rotation, rotationQuaternion, this.spaceship.rotation);
    }
  
    if (e.key === "w") {
      const direction = { x: 0, y: 0, z: 0 };
      QuaternionUtils.rotateVector(this.spaceship.rotation, { x: 0, y: 0.1, z: 0 }, direction);
      console.log("Kierunek po obróceniu:", direction);
      this.spaceship.obj.move(direction.x, direction.y, direction.z);
    }
  }
  
  
  
  
  override Start(): void {
    this.setResolution(640, 480);
    document.addEventListener("keydown", this.handleSpaceshipMove.bind(this));
    console.log(this.spaceship.obj.mesh);
    console.log(this.spaceship.obj.position)
  }


  override Update(): void {
  }

}



// Super kod 123
const game = new MyGame(canvas);
game.run();
