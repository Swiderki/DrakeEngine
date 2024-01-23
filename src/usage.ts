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
import { dir } from "console";
const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  cubes: Cube[] = [];
  spaceship;
  bullets: Bullet[] = [];
  asteroids: Asteroid[] = [];
  keysPressed: Set<string> = new Set();
  lastAsteroidSpawnTime: number = Date.now();

  constructor(canvas: HTMLCanvasElement) {
    const camera = new Drake.Camera(69, 0.1, 1000, [0, 0, -10], [0, 0, 1]);
    super(canvas, camera);
    this.cubes.forEach((cube) => this.addSceneMesh(cube));
    this.spaceship = { obj: new Spaceship([0, 0, 0], [0.01, 0.01, 0.01]), rotation: { x: 0, y: 0, z: 0, w: 1 } };

    // 13x, 8y
    this.asteroids.push(new Asteroid(6, "m", [0, 0, 0], [0.01, 0.01, 0.01]))

    this.addSceneMesh(this.spaceship.obj);

    // this.createRandomAsteroid();

    const bullet = new Bullet([this.spaceship.obj.position.x, this.spaceship.obj.position.y, this.spaceship.obj.position.z]);
    this.addSceneMesh(bullet);
    this.bullets.push(bullet);
  }

  createRandomAsteroid() {
    console.log("xd")

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
    const normalizedVelocity = velocityDirection.map(v => v / Math.sqrt(velocityDirection[0]**2 + velocityDirection[1]**2));
    const velocity = normalizedVelocity.map(v => v * velocityMagnitude);
  
    // Tworzenie asteroidy
    const ast = new Asteroid(size, type, position, [0.01, 0.01, 0.01]);
    ast.velocity = {x: velocity[0], y: velocity[1], z: 0};
    this.addSceneMesh(ast);
    this.asteroids.push(ast);
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
    this.setResolution(1280, 720);

    const camera = new Drake.Camera(90, 0.1, 1000, [10, 10, -15], [0, 0, 1]);
   
    const mainScene = new Drake.Scene(
      this.width,
      this.height,
      this.idGenerator.id
    );
    
    mainScene.setCamera(camera);

    const mainSceneId = this.addScene(mainScene);
    this.setCurrentScene(mainSceneId);
    this.setResolution(640, 480);
    
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
  }


  override Update(): void {

    this.asteroids.forEach(ast => {
      ast.move(ast.velocity.x, ast.velocity.y, ast.velocity.z)
    });

    if (Date.now() - this.lastAsteroidSpawnTime >= 3000) {
      
      // Wywołanie funkcji createRandomAsteroid
      this.createRandomAsteroid();

      // Zaktualizowanie czasu ostatniego spawnu asteroidy
      this.lastAsteroidSpawnTime = Date.now();
    }

  }

}



const game = new MyGame(canvas);
game.run();
