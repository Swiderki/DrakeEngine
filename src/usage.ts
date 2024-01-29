import Drake from "./index";
import { QuaternionUtils } from "@/src/util/quaternions";
import Asteroid from "./asteroids/objects/asteroid";
import Spaceship from "./asteroids/objects/spaceship";
import Bullet from "./asteroids/objects/bullet";
import Scene from "./Scene";
import GameObject from "./entities/game-objects/GameObject";
import { Overlap } from "./behavior/Overlap";
const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

// Without destroing elements whene they quit screen

class AsteroidPlayerOverlap extends Overlap {
  private game: MyGame;
  constructor(obj1: GameObject, obj2: GameObject, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
  }

  override onOverlap(): void {
    console.log("xd");
  }
}

class MyGame extends Drake.Engine {
  spaceship;
  mainScene: Scene | null = null;
  bullets: Bullet[] = [];
  asteroids: Asteroid[] = [];
  keysPressed: Set<string> = new Set();
  lastAsteroidSpawnTime: number = Date.now();

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);

    this.spaceship = {
      obj: new Spaceship([0, 0, 0], [0.01, 0.01, 0.01]),
      rotation: { x: 0, y: 0, z: 0, w: 1 },
    };
    this.spaceship.obj.boxCollider = [
      { x: -0.2, y: 0.3, z: 0 },
      { x: 0.3, y: -0.3, z: -3 },
    ];

    this.spaceship.obj.showBoxcollider = true;
  }

  createRandomAsteroid() {
    if (this.mainScene == null) {
      throw new Error("Main scene must be set first.");
    }

    // Losowanie rozmiaru (1 do 15)
    const size = Math.floor(Math.random() * 15) + 1;

    // Losowanie typu ('l', 'm', 's')
    const type = ["l", "m", "s"][Math.floor(Math.random() * 3)];

    // Losowanie pozycji
    const edge = ["left", "right", "top", "bottom"][
      Math.floor(Math.random() * 4)
    ];
    let position: [number, number, number];
    if (edge === "left") {
      position = [-18, Math.random() * 16 - 8, 0];
    } else if (edge === "right") {
      position = [18, Math.random() * 16 - 8, 0];
    } else if (edge === "top") {
      position = [Math.random() * 36 - 18, 8, 0];
    } else {
      // bottom
      position = [Math.random() * 36 - 18, -8, 0];
    }

    // Losowanie punktu docelowego, który nie jest środkiem
    let targetPosition;
    do {
      targetPosition = [Math.random() * 26 - 13, Math.random() * 10 - 5];
    } while (targetPosition[0] === 0 && targetPosition[1] === 0);

    // Losowanie i obliczanie wektora prędkości
    const velocityMagnitude = Math.random() * 6 + 3;
    const velocityDirection = [
      targetPosition[0] - position[0],
      targetPosition[1] - position[1],
    ];
    const normalizedVelocity = velocityDirection.map(
      (v) =>
        v / Math.sqrt(velocityDirection[0] ** 2 + velocityDirection[1] ** 2)
    );
    const velocity = normalizedVelocity.map((v) => v * velocityMagnitude);

    // Tworzenie asteroidy
    const ast = new Asteroid(size, type, position, [0.01, 0.01, 0.01]);
    ast.velocity = { x: velocity[0], y: velocity[1], z: 0 };
    this.mainScene.addSceneMesh(ast);
    this.asteroids.push(ast);

    this.currentScene.addOverlap(new AsteroidPlayerOverlap(this.spaceship.obj, ast, this));
  }

  handleSpaceshipMove() {
    const rotationAmount = Math.PI / 16;

    if (this.keysPressed.has("a")) {
      const rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };
      QuaternionUtils.setFromAxisAngle(
        rotationQuaternion,
        { x: 0, y: 0, z: 1 },
        rotationAmount
      );
      QuaternionUtils.normalize(rotationQuaternion);
      this.spaceship.obj.applyQuaternion(rotationQuaternion);
      QuaternionUtils.multiply(
        this.spaceship.rotation,
        rotationQuaternion,
        this.spaceship.rotation
      );
      QuaternionUtils.normalize(this.spaceship.rotation);
    }
    if (this.keysPressed.has("d")) {
      const rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };
      QuaternionUtils.setFromAxisAngle(
        rotationQuaternion,
        { x: 0, y: 0, z: -1 },
        rotationAmount
      );
      QuaternionUtils.normalize(rotationQuaternion);
      this.spaceship.obj.applyQuaternion(rotationQuaternion);
      QuaternionUtils.multiply(
        this.spaceship.rotation,
        rotationQuaternion,
        this.spaceship.rotation
      );
      QuaternionUtils.normalize(this.spaceship.rotation);
    }

    if (this.keysPressed.has("w")) {
      const direction = { x: 0, y: 0, z: 0 };
      QuaternionUtils.rotateVector(
        this.spaceship.rotation,
        { x: 0, y: 0.1, z: 0 },
        direction
      );
      // console.log("Kierunek po obróceniu:", direction);
      this.spaceship.obj.move(direction.x, direction.y, direction.z);
    }
  }

  handleKeyDown(e: KeyboardEvent) {
    this.keysPressed.add(e.key);
    this.handleSpaceshipMove();
  }

  handleKeyUp(e: KeyboardEvent) {
    this.keysPressed.delete(e.key);
  }

  override Start(): void {
    this.setResolution(1280, 720);

    const camera = new Drake.Camera(69, 0.1, 1000, [0, 0, -10], [0, 0, 1]);

    const mainScene = new Drake.Scene(this.width, this.height);

    mainScene.addSceneMesh(this.spaceship.obj);

    mainScene.setCamera(camera);

    const bullet = new Bullet([
      this.spaceship.obj.position.x,
      this.spaceship.obj.position.y,
      this.spaceship.obj.position.z,
    ]);
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
    if (Date.now() - this.lastAsteroidSpawnTime >= 1500) {
      const randimizer = Math.random();
      if (randimizer > 0.95) return;
      // Wywołanie funkcji createRandomAsteroid
      this.createRandomAsteroid();

      // Zaktualizowanie czasu ostatniego spawnu asteroidy
      this.lastAsteroidSpawnTime = Date.now();
    }

    if (this.currentScene != null)
    for (const v of this.currentScene.gameObjects.values()) {
      console.log(v.position.z)
    }
  }
}

const game = new MyGame(canvas);
game.run();
