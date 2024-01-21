import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";
import { QuaternionUtils } from "@/src/util/quaternions";
import Asteroid from "./asteroids/objects/asteroid";
import Spaceship from "./asteroids/objects/spaceship";
import Piramide from "./entities/game-objects/built-in/Piramide";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");



class MyGame extends Drake.Engine {
  cubes: Cube[] = [];
  // axis;
  pyramide;

  rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };

  constructor(canvas: HTMLCanvasElement) {
    const camera = new Drake.Camera(69, 0.1, 1000, [0, 0, -10], [0, 0, 1]);
    super(canvas, camera);
    // [...Array(1400)].forEach((_, i) => {
    //   this.cubes.push(new Cube([i * 5, 0, 0]));
    // })
    // this.axis = new Drake.GameObject("objects/axis_wire.obj");
    // blad byl w asteroids sciezka jest bezwzgledna tzn wzgledem katalogu glownego projectu, a nie relatywna
    this.cubes.forEach((cube) => this.addSceneMesh(cube));
    this.pyramide = new Spaceship([0, 0, 0],[0.01,0.01,0.01]);

    // [...Array(100)].map((_, i) => this.addSceneMesh(new Drake.Cube([i * 0.1, 0, 0])));
    this.addSceneMesh(this.pyramide);
    // this.addSceneMesh(this.cube);
  }

  handleCameraMove(e: KeyboardEvent) {
    if (e.key === "w") this.mainCamera.move(0, 1, 0);
    if (e.key === "s") this.mainCamera.move(0, -1, 0);
    if (e.key === "a") this.mainCamera.move(-1, 0, 0);
    if (e.key === "d") this.mainCamera.move(1, 0, 0);
  }

  override Start(): void {
    this.setResolution(640, 480);
    document.addEventListener("keydown", this.handleCameraMove.bind(this));
    console.log(this.pyramide.mesh);
    console.log(this.pyramide.position)
  }


  override Update(): void {
    const rotationSpeed = Math.PI / 2; 
  
    QuaternionUtils.setFromAxisAngle(
      this.rotationQuaternion, 
      { x: 0, y: 0, z: 1 },
      rotationSpeed * this.deltaTime 
    );
    QuaternionUtils.normalize(this.rotationQuaternion);
   this.pyramide.applyQuaternion(this.rotationQuaternion);
   }
  
}
  


// Super kod 123
const game = new MyGame(canvas);
game.run();
