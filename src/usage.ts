import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";
import { GUIText } from "./gui/GUIElements/GUIText";
import { Button } from "./gui/GUIElements/Button";
import { Input } from "./gui/GUIElements/Input";
import { Icon } from "./gui/GUIElements/Icon";
import GUI from "./gui/Gui";

import { QuaternionUtils } from "@/src/util/quaternions";
import Asteroid from "./asteroids/objects/asteroid";
import Spaceship from "./asteroids/objects/spaceship";
import Bullet from "./asteroids/objects/bullet";
import { dir, log } from "console";
import Scene from "./Scene";
const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

// Without destroing elements whene they quit screen


class MyGame extends Drake.Engine {
  spaceship;
  mainScene: Scene | null = null;
  bullets: Bullet[] = [];
  asteroids: Asteroid[] = [];
  keysPressed: Set<string> = new Set();
  lastAsteroidSpawnTime: number = Date.now();
  rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.spaceship = { obj: new Spaceship([0, 0, 0], [0.01, 0.01, 0.01]), rotation: { x: 0, y: 0, z: 0, w: 1 } };
  }

  createRandomAsteroid() {
    if (this.mainScene == null) {
      throw new Error("Main scene must be set first.");
    }

    // Losowanie rozmiaru (1 do 15)
    const size = Math.floor(Math.random() * 15) + 1;

    // Losowanie typu ('l', 'm', 's')
    const type = ['l', 'm', 's'][Math.floor(Math.random() * 3)];

    // Losowanie pozycji
    const edge = ['left', 'right', 'top', 'bottom'][Math.floor(Math.random() * 4)];
    let position: [number, number, number];
    if (edge === 'left') {
      position = [-13, Math.random() * 10 - 5, 0];
    } else if (edge === 'right') {
      position = [13, Math.random() * 10 - 5, 0];
    } else if (edge === 'top') {
      position = [Math.random() * 26 - 13, 5, 0];
    } else {
      position = [Math.random() * 26 - 13, -5, 0];
    }

    // Losowanie i obliczanie wektora prędkości
    const velocityMagnitude = Math.random() * 0.2 + 0.1;
    const centerPosition = [0, 0];
    const velocityDirection = [centerPosition[0] - position[0], centerPosition[1] - position[1]];
    const normalizedVelocity = velocityDirection.map(v => v / Math.sqrt(velocityDirection[0] ** 2 + velocityDirection[1] ** 2));
    const velocity = normalizedVelocity.map(v => v * velocityMagnitude);

    // Tworzenie asteroidy
    const ast = new Asteroid(size, type, position, [0.01, 0.01, 0.01]);
    ast.velocity = { x: velocity[0], y: velocity[1], z: 0 };
    this.mainScene!.addSceneMesh(ast);
    this.asteroids.push(ast);
  }



  logRotationAngles(): void {
    const quaternion = this.spaceship.rotation; // Zakładamy, że _rotation jest kwaternionem
    const angles = this.quaternionToEulerAngles(quaternion);
    console.log(`Rotation Angles: X=${angles.x}, Y=${angles.y}, Z=${angles.z}`);
  }
  quaternionToEulerAngles(quaternion: any): { x: number; y: number; z: number } {
    // Konwersja kwaternionu na kąty Eulera (w stopniach)
    const sinr_cosp = 2 * (quaternion.w * quaternion.x + quaternion.y * quaternion.z);
    const cosr_cosp = 1 - 2 * (quaternion.x * quaternion.x + quaternion.y * quaternion.y);
    const x = Math.atan2(sinr_cosp, cosr_cosp);

    const sinp = 2 * (quaternion.w * quaternion.y - quaternion.z * quaternion.x);
    let y;
    if (Math.abs(sinp) >= 1) {
      y = Math.PI / 2 * Math.sign(sinp); // Użycie 90 stopni, jeśli wynik jest poza zakresem
    } else {
      y = Math.asin(sinp);
    }

    const siny_cosp = 2 * (quaternion.w * quaternion.z + quaternion.x * quaternion.y);
    const cosy_cosp = 1 - 2 * (quaternion.y * quaternion.y + quaternion.z * quaternion.z);
    const z = Math.atan2(siny_cosp, cosy_cosp);

    // Konwersja radianów na stopnie
    return {
      x: x * (180 / Math.PI),
      y: y * (180 / Math.PI),
      z: z * (180 / Math.PI)
    };
  }
  handleSpaceshipMove() {
    const rotationAmount = Math.PI / 16;

    if (this.keysPressed.has("a")) {
      QuaternionUtils.setFromAxisAngle(this.rotationQuaternion, { x: 0, y: 0, z: 1 }, rotationAmount);
      QuaternionUtils.multiply(this.spaceship.rotation, this.rotationQuaternion, this.spaceship.rotation);
      QuaternionUtils.normalize(this.spaceship.rotation);
      this.spaceship.obj.applyQuaternion(this.rotationQuaternion);
    }

    if (this.keysPressed.has("d")) {
      QuaternionUtils.setFromAxisAngle(this.rotationQuaternion, { x: 0, y: 0, z: -1 }, rotationAmount);
      QuaternionUtils.multiply(this.spaceship.rotation, this.rotationQuaternion, this.spaceship.rotation);
      QuaternionUtils.normalize(this.spaceship.rotation);
      this.spaceship.obj.applyQuaternion(this.rotationQuaternion);
    }

    if (this.keysPressed.has("w")) {
      const forwardVector = { x: 0, y: 1, z: 0 };
      const direction = { x: 0, y: 0, z: 0 };
      QuaternionUtils.rotateVector(this.spaceship.rotation, forwardVector, direction);
      const speed = 0.1;
      this.spaceship.obj.move(direction.x * speed, direction.y * speed, direction.z * speed);
      const bullet = new Bullet([this.spaceship.obj.position.x, this.spaceship.obj.position.y, this.spaceship.obj.position.z]);
      this.mainScene!.addSceneMesh(bullet);
      this.bullets.push(bullet);
    }

  }

  handleKeyDown(e: KeyboardEvent) {
    this.keysPressed.add(e.key)
    this.handleSpaceshipMove();
  }

  handleKeyUp(e: KeyboardEvent) {
    this.keysPressed.delete(e.key);
  }

  compareMovementAndRotation() {
    // Załóżmy, że ruch do przodu statku jest wzdłuż osi Y
    const movementVector = { x: 0, y: 1, z: 0 };

    // Oblicz kierunek ruchu na podstawie obrotu statku
    const directionVector = { x: 0, y: 0, z: 0 };
    QuaternionUtils.rotateVector(this.spaceship.rotation, movementVector, directionVector);

    // Porównaj obliczony kierunek z rzeczywistym wektorem ruchu
    const angle = angleBetweenVectors(movementVector, directionVector);
    console.log("Kąt między kierunkiem ruchu a rotacją:", angle);
  }

  override Start(): void {
    this.setResolution(1280, 720);

    const camera = new Drake.Camera(69, 0.1, 1000, [0, 0, -10], [0, 0, 1]);

    const mainScene = new Drake.Scene(
      this.width,
      this.height,
    );

    mainScene.addSceneMesh(this.spaceship.obj);

    mainScene.setCamera(camera);

    const bullet = new Bullet([this.spaceship.obj.position.x, this.spaceship.obj.position.y, this.spaceship.obj.position.z]);
    mainScene.addSceneMesh(bullet);
    this.bullets.push(bullet);


    const mainSceneId = this.addScene(mainScene);
    this.setCurrentScene(mainSceneId);
    this.setResolution(1280, 720);

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));

    this.mainScene = mainScene;

    this.createRandomAsteroid();
  }


  override Update(): void {

    // this.compareMovementAndRotation();

    // this.asteroids.forEach(ast => {
    //   ast.move(ast.velocity.x, ast.velocity.y, ast.velocity.z)
    // });

    // if (Date.now() - this.lastAsteroidSpawnTime >= 2000) {

    //   // Wywołanie funkcji createRandomAsteroid
    //   this.createRandomAsteroid();

    //   // Zaktualizowanie czasu ostatniego spawnu asteroidy
    //   this.lastAsteroidSpawnTime = Date.now();
    // }

  }

}



const game = new MyGame(canvas);
game.run();

function angleBetweenVectors(v1: any, v2: any) {
  const dotProduct = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const magnitudeV1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const magnitudeV2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
  return Math.acos(dotProduct / (magnitudeV1 * magnitudeV2));
}
