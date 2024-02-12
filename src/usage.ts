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
  constructor(obj1: Spaceship, obj2: Asteroid, game: MyGame) {
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
    const ast = new Asteroid(size, type, position, [0.1, 0.1, 0.1]);
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
    if (this.keysPressed.has("k")) {
      const bullet = new Bullet([this.spaceship.obj.position.x, this.spaceship.obj.position.y,this.spaceship.obj.position.z], [0.5,0.5,0.5], [0,0,0],this.spaceship.rotation );
      const bulletID = this.mainScene?.addSceneMesh(bullet);
      console.log(this.spaceship.obj.position)
    }


  }

  handleKeyDown(e: KeyboardEvent) {
    this.keysPressed.add(e.key);
    if (e.key == "w") {
      this.flame.obj.setPosition(this.spaceship.obj.position.x, this.spaceship.obj.position.y, this.spaceship.obj.position.z)
    }
    this.handleSpaceshipMove();

  }

  handleKeyUp(e: KeyboardEvent) {
    this.keysPressed.delete(e.key);

    if (e.key == "w") {
      this.flame.obj.setPosition(1231231231, 123123123, 123123123)

    }
  }

  override Start(): void {
    this.setResolution(1280, 720);



    const camera = new Drake.Camera(60, 0.1, 1000, [0, 0, -10], [0, 0, 1]);

    const mainScene = new Drake.Scene(this.width, this.height);
    const svgPath = "m 10 0 l 10 40 l -3 -5 l -14 0 l -3 5 z"
    const mainSceneGUI = new GUI(this.getCanvas, this.getCanvas.getContext("2d")!);
    const resultText = new GUIText("00", 35, "Arial", "white", 100);
    const bestResultText = new GUIText("00", 35, "Arial", "white", 100);
    const icon1 = new Icon(svgPath, 770, 770, { x: 245, y: 60 });
    const icon2 = new Icon(svgPath, 770, 770, { x: 265, y: 60 });
    const icon3 = new Icon(svgPath, 770, 770, { x: 285, y: 60 });

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
