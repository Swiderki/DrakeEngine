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
import { Button } from "./gui/GUIElements/Button";
if (!canvas) throw new Error("unable to find canvas");

// Without destroing elements whene they quit screen

class AsteroidPlayerOverlap extends Overlap {
  private game: MyGame;
  constructor(obj1: Spaceship, obj2: Asteroid, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
  }

  override onOverlap(): void {
    if (!game.currentScene) return;
  }
}

class BulletAsteroidOverlap extends Overlap {
  private game: MyGame;
  private bullet: Bullet;
  private bulletID: number;
  private astID: number;
  private asteroid: Asteroid;
  constructor(
    obj1: Bullet,
    obj2: Asteroid,
    bulletID: number,
    astID: number,
    game: MyGame
  ) {
    super(obj1, obj2);
    this.game = game;
    this.bullet = obj1;
    this.asteroid = obj2;
    this.bulletID = bulletID;
    this.astID = astID;
  }

  override onOverlap() {
    console.log("XDDD");
    if (this.asteroid.metricalSize == "l") {
      this.game.createRandomAsteroidAtPosition("m", [this.asteroid.position.x, this.asteroid.position.y, this.asteroid.position.z]);
      this.game.createRandomAsteroidAtPosition("m", [this.asteroid.position.x, this.asteroid.position.y, this.asteroid.position.z]);
      this.game.createRandomAsteroidAtPosition("m", [this.asteroid.position.x, this.asteroid.position.y, this.asteroid.position.z]);
    }

    if (this.asteroid.metricalSize == "m") {
      this.game.createRandomAsteroidAtPosition("s", [this.asteroid.position.x, this.asteroid.position.y, this.asteroid.position.z]);
      this.game.createRandomAsteroidAtPosition("s", [this.asteroid.position.x, this.asteroid.position.y, this.asteroid.position.z]);
      this.game.createRandomAsteroidAtPosition("s", [this.asteroid.position.x, this.asteroid.position.y, this.asteroid.position.z]);
    }

    this.game.currentScene!.killObject(this.bulletID);
    this.game.currentScene!.killObject(this.astID);
    this.game.asteroids.delete(this.astID);
  }
}

class StartButton extends Button {
  game: MyGame;
  constructor(game: MyGame) {
    super("Start", 35, "monospace", "#fff");
    this.game = game;
  }

  override onHover(): void {
    const color = "lime";
    this.color = color;
    this.border.bottom.color = color;
    this.border.top.color = color;
    this.border.left.color = color;
    this.border.right.color = color;
  }

  override onClick(): void {
    this.game.changeScene();
    this.game.asteroids.clear();
  }
}

class MyGame extends Drake.Engine {
  spaceship;
  mainScene: Scene | null = null;
  gameScene: number | null = null;
  GUIScene: number | null = null;
  startButton: Button | null = null;
  bullets: Bullet[] = [];
  asteroids: Map<number, Asteroid> = new Map();
  keysPressed: Set<string> = new Set();
  lastAsteroidSpawnTime: number = Date.now();
  rotationQuaternion: { x: number; y: number; z: number; w: number } = {
    x: 0,
    y: 0,
    z: 0,
    w: 1,
  };
  flame;

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.flame = {
      obj: new Flame([0, 0, 0], [0.1, 0.1, 0.1]),
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      id: 0,
    };
    this.spaceship = {
      obj: new Spaceship([0, 0, 0], [0.1, 0.1, 0.1]),
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      id: 0,
    };
    this.spaceship.obj.boxCollider = [
      { x: -0.2, y: 0.3, z: 0 },
      { x: 0.3, y: -0.3, z: -1 },
    ];

    this.spaceship.obj.showBoxcollider = true;
  }

  changeScene() {
    this.setCurrentScene(this.gameScene!);
  }

  createRandomAsteroidAtPosition(asteroidType: 'l' | 'm' | 's', position: [number, number, number]) {
    if (this.currentScene == null) {
        throw new Error("Main scene must be set first.");
    }

    // Losowanie punktu docelowego, który nie jest środkiem, aby uniknąć przypadku, gdy asteroida nie poruszałaby się
    let targetPosition;
    do {
        targetPosition = [Math.random() * 26 - 13, Math.random() * 10 - 5, 0];
    } while (targetPosition[0] === position[0] && targetPosition[1] === position[1]);

    // Losowanie i obliczanie wektora prędkości
    const velocityMagnitude = Math.random() * (4 - 2) + 2; // Losowanie prędkości z zakresu [2, 4]
    const velocityDirection = [
        targetPosition[0] - position[0],
        targetPosition[1] - position[1],
        0
    ];
    const normalizedVelocity = velocityDirection.map(
        v => v / Math.sqrt(velocityDirection[0] ** 2 + velocityDirection[1] ** 2)
    );
    const velocity = normalizedVelocity.map(v => v * velocityMagnitude);

    // Tworzenie asteroidy z podanym typem i pozycją
    const ast = new Asteroid(Math.floor(Math.random() * 15) + 1, asteroidType, position, [0.1, 0.1, 0.1]);
    ast.velocity = { x: velocity[0], y: velocity[1], z: 0 };
    const astId = this.currentScene.addSceneMesh(ast);

    this.asteroids.set(astId, ast);

    this.currentScene.addOverlap(
        new AsteroidPlayerOverlap(this.spaceship.obj, ast, this)
    );
}


  createRandomAsteroid() {
    if (this.currentScene == null) {
      throw new Error("Main scene must be set first.");
    }

    // Losowanie rozmiaru (1 do 15)
    const size = Math.floor(Math.random() * 15) + 1;

    // Losowanie typu ('l', 'm', 's')
    const type = ["l", "m", "s"][Math.floor(Math.random() * 3)] as "l" | "m" | "s";

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
    const ast = new Asteroid(size, type, position, [0.1, 0.1, 0.1]);
    ast.velocity = { x: velocity[0], y: velocity[1], z: 0 };
    const astId = this.currentScene.addSceneMesh(ast);

    this.asteroids.set(astId, ast);

    this.currentScene.addOverlap(
      new AsteroidPlayerOverlap(this.spaceship.obj, ast, this)
    );
  }

  handleSpaceshipMove() {
    const rotationAmount = Math.PI / 16;

    if (this.keysPressed.has("a")) {
      QuaternionUtils.setFromAxisAngle(
        this.rotationQuaternion,
        { x: 0, y: 0, z: 1 },
        rotationAmount
      );
      QuaternionUtils.multiply(
        this.spaceship.rotation,
        this.rotationQuaternion,
        this.spaceship.rotation
      );
      QuaternionUtils.multiply(
        this.flame.rotation,
        this.rotationQuaternion,
        this.flame.rotation
      );
      QuaternionUtils.normalize(this.spaceship.rotation);
      QuaternionUtils.normalize(this.flame.rotation);
      this.spaceship.obj.applyQuaternion(this.rotationQuaternion);
      this.flame.obj.applyQuaternion(this.rotationQuaternion);
    }

    if (this.keysPressed.has("d")) {
      QuaternionUtils.setFromAxisAngle(
        this.rotationQuaternion,
        { x: 0, y: 0, z: -1 },
        rotationAmount
      );
      QuaternionUtils.multiply(
        this.spaceship.rotation,
        this.rotationQuaternion,
        this.spaceship.rotation
      );
      QuaternionUtils.multiply(
        this.flame.rotation,
        this.rotationQuaternion,
        this.flame.rotation
      );
      QuaternionUtils.normalize(this.flame.rotation);
      QuaternionUtils.normalize(this.spaceship.rotation);
      this.spaceship.obj.applyQuaternion(this.rotationQuaternion);
      this.flame.obj.applyQuaternion(this.rotationQuaternion);
    }

    if (this.keysPressed.has("w")) {
      const forwardVector = { x: 0, y: 1, z: 0 };
      const direction = { x: 0, y: 0, z: 0 };

      QuaternionUtils.rotateVector(
        this.spaceship.rotation,
        forwardVector,
        direction
      );
      const speed = 0.3;
      direction.x *= speed;
      direction.y *= speed;
      direction.z *= speed;
      this.flame.obj.applyForce(direction);
      this.spaceship.obj.applyForce(direction);
    }
    if (this.keysPressed.has("l")) {
      const x = Math.random() * 20 - 10;
      const y = Math.random() * 10 - 5;
      this.currentScene.killObject(this.spaceship.id);
      this.currentScene.killObject(this.flame.id);

      setTimeout(() => {
        this.spaceship.obj.setPosition(x, y, 0);
        this.flame.obj.setPosition(x, y, 0);
        this.spaceship.id = this.currentScene.addSceneMesh(this.spaceship.obj)!;
        this.flame.id = this.currentScene.addSceneMesh(this.flame.obj)!;
      }, 700);
    }
    if (this.keysPressed.has("k")) {
      console.log("xd");
      const bullet = new Bullet(
        [
          this.spaceship.obj.position.x,
          this.spaceship.obj.position.y,
          this.spaceship.obj.position.z,
        ],
        [0.5, 0.5, 0.5],
        [0, 0, 0],
        this.spaceship.rotation
      );
      bullet.boxCollider = [
        { x: -0.1, y: -0.1, z: 0 },
        { x: 0.1, y: 0.1, z: -1 },
      ];
      bullet.showBoxcollider = true;
      const bulletID = this.currentScene.addSceneMesh(bullet);

      if (this.currentScene == this.mainScene) {
        this.asteroids.forEach((el, k) => {
          console.log("test");
          const ov = new BulletAsteroidOverlap(bullet, el, bulletID, k, this);
          this.currentScene.addOverlap(ov);
        });
      }

      console.log(this.spaceship.obj.position);
    }
  }

  handleKeyDown(e: KeyboardEvent) {
    this.keysPressed.add(e.key);
    if (e.key == "w") {
      this.flame.obj.setPosition(
        this.spaceship.obj.position.x,
        this.spaceship.obj.position.y,
        this.spaceship.obj.position.z
      );
    }
    this.handleSpaceshipMove();
  }

  handleKeyUp(e: KeyboardEvent) {
    this.keysPressed.delete(e.key);

    if (e.key == "w") {
      this.flame.obj.setPosition(1231231231, 123123123, 123123123);
    }
  }

  override Start(): void {
    this.setResolution(1280, 720);

    const camera = new Drake.Camera(60, 0.1, 1000, [0, 0, -10], [0, 0, 1]);

    const mainScene = new Drake.Scene(this.width, this.height);
    this.mainScene = mainScene;

    const svgPath = "m 10 0 l 10 40 l -3 -5 l -14 0 l -3 5 z";
    const mainSceneGUI = new GUI(
      this.getCanvas,
      this.getCanvas.getContext("2d")!
    );
    mainSceneGUI.hideCursor = true;
    const resultText = new GUIText("00", 35, "Arial", "white", 100);
    const bestResultText = new GUIText("00", 35, "Arial", "white", 100);
    const icon1 = new Icon(svgPath, 770, 770, { x: 245, y: 60 }, "white");
    const icon2 = new Icon(svgPath, 770, 770, { x: 265, y: 60 }, "white");
    const icon3 = new Icon(svgPath, 770, 770, { x: 285, y: 60 }, "white");

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

    const GUIScene = new Drake.Scene(this.width, this.height);
    const GUISceneGUI = new GUI(
      this.getCanvas,
      this.getCanvas.getContext("2d")!
    );
    GUIScene.setCamera(camera);

    const t1 = new GUIText("Asteroids", 70, "monospace", "#fff", 700);
    const t2 = new GUIText("Made by Świderki", 16, "monospace", "#fff", 700);
    const t3 = new StartButton(this);
    t3.padding.bottom = 30;
    t3.padding.top = 30;
    t3.padding.right = 90;
    t3.padding.left = 90;
    t1.position.x = (this.width - t1.width) / 2;
    t1.position.y = this.height / 2 - 100;
    t2.position.x = (this.width - t1.width) / 2;
    t3.position.x = (this.width - t1.width) / 2;

    t3.position.y = t1.position.y + t1.height + 5 + t2.height + 30;
    t2.position.y = t1.position.y + t1.height + 5;

    this.startButton = t3;

    GUISceneGUI.addElement(t1);
    GUISceneGUI.addElement(t2);
    GUISceneGUI.addElement(t3);

    const GUISceneGUIID = GUIScene.addGUI(GUISceneGUI);
    GUIScene.setCurrentGUI(GUISceneGUIID);

    const mainSceneId = this.addScene(mainScene);
    const GUISceneID = this.addScene(GUIScene);
    this.setCurrentScene(GUISceneID);
    this.setResolution(1280, 720);

    this.gameScene = mainSceneId;
    this.GUIScene = GUISceneID;

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));


    this.setCurrentScene(this.addScene(GUIScene));

    this.getCanvas.addEventListener("mousemove", (e: MouseEvent) => {
      if (
        this.startButton &&
        !this.startButton!.isCoordInElement(e.clientX, e.clientY)
      ) {
        const color = "white";
        this.startButton!.color = color;
        this.startButton!.border.bottom.color = color;
        this.startButton!.border.top.color = color;
        this.startButton!.border.left.color = color;
        this.startButton!.border.right.color = color;
      }
    });
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
