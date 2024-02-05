import Drake from "./index";
import { QuaternionUtils } from "@/src/util/quaternions";
import Asteroid from "./asteroids/objects/asteroid";
import Spaceship from "./asteroids/objects/spaceship";
import Bullet from "./asteroids/objects/bullet";
import Scene from "./Scene";
import GameObject from "./entities/game-objects/GameObject";
import { Overlap } from "./behavior/Overlap";
import Flame from "./asteroids/objects/flame";
const canvas = document.getElementById("app") as HTMLCanvasElement | null;
import GUI from "./gui/Gui";
import { GUIText } from "./gui/GUIElements/GUIText";
import { Icon } from "./gui/GUIElements/Icon";
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

class TestOverlap extends Overlap {
  constructor(obj1: GameObject, obj2: GameObject) {
    super(obj1, obj2);
  }
}

class MyGame extends Drake.Engine {
  spaceship;
  mainScene: Scene | null = null;
  bullets: Bullet[] = [];
  asteroids: Asteroid[] = [];
  keysPressed: Set<string> = new Set();
  lastAsteroidSpawnTime: number = Date.now();
  rotationQuaternion: { x: number; y: number; z: number; w: number } = { x: 0, y: 0, z: 0, w: 1 };
  flame;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.flame = {
      obj: new Flame([0, 0, 0], [0.1, 0.1, 0.1]),
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      id: 0
    };
    this.spaceship = {
      obj: new Spaceship([0, 0, 0], [0.1, 0.1, 0.1]),
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      id: 0
    };
    this.spaceship.obj.boxCollider = [
      { x: -0.2, y: 0.3, z: 0 },
      { x: 0.3, y: -0.3, z: -5 },
    ];


    // this.spaceship.obj.showBoxcollider = true;
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
    const edge = ["left", "right", "top", "bottom"][Math.floor(Math.random() * 4)];
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
    const velocityDirection = [targetPosition[0] - position[0], targetPosition[1] - position[1]];
    const normalizedVelocity = velocityDirection.map(
      (v) => v / Math.sqrt(velocityDirection[0] ** 2 + velocityDirection[1] ** 2)
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
      QuaternionUtils.setFromAxisAngle(this.rotationQuaternion, { x: 0, y: 0, z: 1 }, rotationAmount);
      QuaternionUtils.multiply(this.spaceship.rotation, this.rotationQuaternion, this.spaceship.rotation);
      QuaternionUtils.multiply(this.flame.rotation, this.rotationQuaternion, this.flame.rotation);
      QuaternionUtils.normalize(this.spaceship.rotation);
      QuaternionUtils.normalize(this.flame.rotation);
      this.spaceship.obj.applyQuaternion(this.rotationQuaternion);
      this.flame.obj.applyQuaternion(this.rotationQuaternion);

    }

    if (this.keysPressed.has("d")) {
      QuaternionUtils.setFromAxisAngle(this.rotationQuaternion, { x: 0, y: 0, z: -1 }, rotationAmount);
      QuaternionUtils.multiply(this.spaceship.rotation, this.rotationQuaternion, this.spaceship.rotation);
      QuaternionUtils.multiply(this.flame.rotation, this.rotationQuaternion, this.flame.rotation);
      QuaternionUtils.normalize(this.flame.rotation);
      QuaternionUtils.normalize(this.spaceship.rotation);
      this.spaceship.obj.applyQuaternion(this.rotationQuaternion);
      this.flame.obj.applyQuaternion(this.rotationQuaternion);
    }

    if (this.keysPressed.has("w")) {
      const forwardVector = { x: 0, y: 1, z: 0 };
      const direction = { x: 0, y: 0, z: 0 };

      QuaternionUtils.rotateVector(this.spaceship.rotation, forwardVector, direction);
      const speed = 0.3;
      direction.x *= speed;
      direction.y *= speed;
      direction.z *= speed;
      this.flame.obj.applyForce(direction);
      this.spaceship.obj.applyForce(direction);

    }
    if (this.keysPressed.has("l")) {
      const x = Math.random() * 20 - 10
      const y = Math.random() * 10 - 5
      this.mainScene?.killObject(this.spaceship.id)
      this.mainScene?.killObject(this.flame.id)

      setTimeout(() => {
        this.spaceship.obj.setPosition(x, y, 0);
        this.flame.obj.setPosition(x, y, 0);
        this.spaceship.id = this.mainScene?.addSceneMesh(this.spaceship.obj)!;
        this.flame.id = this.mainScene?.addSceneMesh(this.flame.obj)!;
      }, 700);

    }

  }

  handleKeyDown(e: KeyboardEvent) {
    this.keysPressed.add(e.key);
    if (e.key == "w") {
      this.flame.obj.setPosition(this.spaceship.obj.position.x, this.spaceship.obj.position.y, this.spaceship.obj.position.z)
    }
    console.log(this.flame.obj.position)
    this.handleSpaceshipMove();

  }

  handleKeyUp(e: KeyboardEvent) {
    this.keysPressed.delete(e.key);
    console.log(this.flame.obj.position)

    if (e.key == "w") {
      this.flame.obj.setPosition(1231231231, 123123123, 123123123)

    }
  }

  override Start(): void {
    this.setResolution(1280, 720);



    const camera = new Drake.Camera(60, 0.1, 1000, [0, 0, -10], [0, 0, 1]);

    const mainScene = new Drake.Scene(this.width, this.height);
    const svgPath = "M433.601,67.001c-24.7-24.7-57.4-38.2-92.3-38.2s-67.7,13.6-92.4,38.3l-12.9,12.9l-13.1-13.1 c-24.7-24.7-57.6-38.4-92.5-38.4c-34.8,0-67.6,13.6-92.2,38.2c-24.7,24.7-38.3,57.5-38.2,92.4c0,34.9,13.7,67.6,38.4,92.3 l187.8,187.8c2.6,2.6,6.1,4,9.5,4c3.4,0,6.9-1.3,9.5-3.9l188.2-187.5c24.7-24.7,38.3-57.5,38.3-92.4 C471.801,124.501,458.301,91.701,433.601,67.001z M414.401,232.701l-178.7,178l-178.3-178.3c-19.6-19.6-30.4-45.6-30.4-73.3 s10.7-53.7,30.3-73.2c19.5-19.5,45.5-30.3,73.1-30.3c27.7,0,53.8,10.8,73.4,30.4l22.6,22.6c5.3,5.3,13.8,5.3,19.1,0l22.4-22.4 c19.6-19.6,45.7-30.4,73.3-30.4c27.6,0,53.6,10.8,73.2,30.3c19.6,19.6,30.3,45.6,30.3,73.3 C444.801,187.101,434.001,213.101,414.401,232.701z"
    const mainSceneGUI = new GUI(this.getCanvas, this.getCanvas.getContext("2d")!);
    const resultText = new GUIText("00", 35, "Arial", "white", 100);
    const bestResultText = new GUIText("00", 35, "Arial", "white", 100);
    const icon1 = new Icon(svgPath, 70, 70, { x: 230, y: 60 }, "white");
    const icon2 = new Icon(svgPath, 70, 70, { x: 255, y: 60 }, "white");
    const icon3 = new Icon(svgPath, 70, 70, { x: 280, y: 60 }, "white");

    resultText.position = { x: 250, y: 30 };
    bestResultText.position = { x: 600, y: 30 };
    const mainSceneGUIID = mainScene.addGUI(mainSceneGUI);

    mainSceneGUI.addElement(resultText);
    mainSceneGUI.addElement(bestResultText);
    mainSceneGUI.addElement(icon1);
    mainSceneGUI.addElement(icon2);
    mainSceneGUI.addElement(icon3);
    resultText.text = "10";
    mainScene.setCurrentGUI(mainSceneGUIID);



    this.spaceship.id = mainScene.addSceneMesh(this.spaceship.obj);
    this.flame.id = mainScene.addSceneMesh(this.flame.obj);
    mainScene.setCamera(camera);

    const mainSceneId = this.addScene(mainScene);
    this.setCurrentScene(mainSceneId);
    this.setResolution(1280, 720);

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    this.mainScene = mainScene;
  }
  override Update(): void {
    if (this.currentScene != null) {
      const currentTime = Date.now();

      if (currentTime - this.lastAsteroidSpawnTime >= 1500) {
        this.createRandomAsteroid();
        this.lastAsteroidSpawnTime = currentTime;
      }

      // console.log([...this.currentScene.gameObjects.values()][0])
      // console.log([...this.currentScene.gameObjects.values()][1])
    }
  }
}

const game = new MyGame(canvas);
game.run();
