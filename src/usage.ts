import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";
import { QuaternionUtils } from "@/src/util/quaternions";
import Asteroid from "./asteroids/objects/asteroid";
import Spaceship from "./asteroids/objects/spaceship";
import Bullet from "./asteroids/objects/bullet";
import { dir } from "console";
const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");



class MyGame extends Drake.Engine {
  cubes: Cube[] = [];
  spaceship;
  bullets: Bullet[] = [];
  keysPressed: Set<string> = new Set();

  constructor(canvas: HTMLCanvasElement) {
    const camera = new Drake.Camera(69, 0.1, 1000, [0, 0, -10], [0, 0, 1]);
    super(canvas, camera);
    this.cubes.forEach((cube) => this.addSceneMesh(cube));
    this.spaceship = { obj: new Spaceship([0, 0, 0], [0.01, 0.01, 0.01]), rotation: { x: 0, y: 0, z: 0, w: 1 } };
    this.addSceneMesh(this.spaceship.obj);
    const bullet = new Bullet([this.spaceship.obj.position.x, this.spaceship.obj.position.y, this.spaceship.obj.position.z]);
    this.addSceneMesh(bullet);
    this.bullets.push(bullet);
  }

  handleSpaceshipMove() {
    const rotationAmount = Math.PI / 16;

    if (this.keysPressed.has("a")) {
      const rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };
      QuaternionUtils.setFromAxisAngle(rotationQuaternion, { x: 0, y: 0, z: 1 }, rotationAmount);
      QuaternionUtils.normalize(rotationQuaternion);
      this.spaceship.obj.applyQuaternion(rotationQuaternion);
      QuaternionUtils.multiply(this.spaceship.rotation, rotationQuaternion, this.spaceship.rotation);
      QuaternionUtils.normalize(this.spaceship.rotation);

    }
    if (this.keysPressed.has("d")) {
      const rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };
      QuaternionUtils.setFromAxisAngle(rotationQuaternion, { x: 0, y: 0, z: -1 }, rotationAmount);
      QuaternionUtils.normalize(rotationQuaternion);
      this.spaceship.obj.applyQuaternion(rotationQuaternion);
      QuaternionUtils.multiply(this.spaceship.rotation, rotationQuaternion, this.spaceship.rotation);
      QuaternionUtils.normalize(this.spaceship.rotation);

    }

    if (this.keysPressed.has("w")) {
      const direction = { x: 0, y: 0, z: 0 };
      QuaternionUtils.rotateVector(this.spaceship.rotation, { x: 0, y: 0.1, z: 0 }, direction);
      console.log("Kierunek po obróceniu:", direction);
      this.spaceship.obj.move(direction.x, direction.y, direction.z);
    }

  }

  handleKeyDown(e: KeyboardEvent) {
    this.keysPressed.add(e.key)
    this.handleSpaceshipMove();
  }

  handleKeyUp(e: KeyboardEvent) {
    this.keysPressed.delete(e.key);
  }


  override Start(): void {
    this.setResolution(640, 480);
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
  }


  override Update(): void {
  }

}



// Super kod 123
const game = new MyGame(canvas);
game.run();
