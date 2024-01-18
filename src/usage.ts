import Cube from "./entities/game-objects/built-in/Cube";
import Drake from "./index";
import { QuaternionUtils } from "@/src/util/quaternions";
import Piramide from "./entities/game-objects/built-in/Piramide";

const canvas = document.getElementById("app") as HTMLCanvasElement | null;
if (!canvas) throw new Error("unable to find canvas");

class MyGame extends Drake.Engine {
  cubes: Cube[] = [];
  rotationQuaternion = { x: 0, y: 0, z: 0, w: 1 };

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    [...Array(1400)].forEach((_, i) => {
      this.cubes.push(new Cube([i * 5, 0, 0]));
    })
  }

  handleCameraMove(e: KeyboardEvent) {
    if(!this.mainCamera) return;
    if (e.key === "w") this.mainCamera.move(0, 1, 0);
    if (e.key === "s") this.mainCamera.move(0, -1, 0);
    if (e.key === "a") this.mainCamera.move(-1, 0, 0);
  }

  override Start(): void {
     
    const camera = new Drake.Camera(90, 0.1, 1000, [10, 10, -15], [0, 0, 1]);
    const mainScene = new Drake.Scene(      
      this.width,
      this.height,
      this.idGenerator.id
    );

    mainScene.setCamera(camera);
    
    const mainSceneId = this.addScene(mainScene);
    this.setCurrentScene(mainSceneId);
    this.cubes.forEach(cube => mainScene.addSceneMesh(cube));
    
    this.setResolution(640, 480);
    document.addEventListener("keydown", this.handleCameraMove.bind(this));
    
  }

  override Update(): void {
    const rotationSpeed = Math.PI / 2; // Obrót o 360 stopni na sekundę

    // Aktualizacja kwaternionu rotacji
    QuaternionUtils.setFromAxisAngle(
      this.rotationQuaternion, 
      { x: 0, y: 1, z: 0 }, // Oś obrotu
      rotationSpeed * this.deltaTime // Kąt obrotu
    );

    // Normalizacja kwaternionu
    QuaternionUtils.normalize(this.rotationQuaternion);

    // Zastosowanie kwaternionu do obrotu kostek, piramidy i osi
    this.cubes.forEach(cube => cube.applyQuaternion(this.rotationQuaternion));
  }
}
  


const game = new MyGame(canvas);
game.run();
