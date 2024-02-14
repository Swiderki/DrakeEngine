import { Mat4x4, Vec3DTuple } from "@/types/math";
import Overlap from "./behavior/Overlap";
import Camera from "./entities/Camera";
import GameObject from "./entities/game-objects/GameObject";
import PhysicalGameObject from "./entities/game-objects/PhysicalGameObject";
import GUI from "./gui/Gui";
import IDGenerator from "./util/idGenerator";
import { Matrix } from "./util/math";

export default class Scene {
  private _gameObjects: Map<number, GameObject> = new Map();
  private _mainCamera: Camera | null = null;
  private _projMatrix: Mat4x4 = Matrix.zeros();
  private _GUIs: Map<number, GUI> = new Map();
  private _currentGUI: GUI | null = null;
  private _overlaps: Map<number, Overlap> = new Map();

  readonly id: number = IDGenerator.new();

  get overlaps() { return this._overlaps; } // prettier-ignore
  get GUIs() { return this._GUIs; } // prettier-ignore
  get currentGUI() { return this._currentGUI; } // prettier-ignore
  get mainCamera() { return this._mainCamera; } // prettier-ignore
  get gameObjects() { return this._gameObjects; } // prettier-ignore
  get projMatrix() { return this._projMatrix; } // prettier-ignore

  getOverlap(overlapID: number): Overlap {
    if (!this.overlaps.has(overlapID)) {
      throw new Error("There's no overlap with the given id");
    }
    return this.overlaps.get(overlapID)!;
  }

  addOverlap(overlap: Overlap): number {
    if ([...this.overlaps.values()].includes(overlap))
      throw new Error("The given overlap is already added to the scene's overlaps.");

    const overlapID = IDGenerator.new();

    this.overlaps.set(overlapID, overlap);
    return overlapID;
  }

  removeOverlap(overlapID: number): number {
    if (!this.overlaps.has(overlapID)) {
      throw new Error("There's no overlap with the given id");
    }

    this.overlaps.delete(overlapID);
    return overlapID;
  }

  addGUI(gui: GUI): number {
    if ([...this._GUIs.values()].includes(gui)) {
      throw new Error("Given gui is already added to this scene");
    }
    const guiID = IDGenerator.new();
    this._GUIs.set(guiID, gui);
    return guiID;
  }

  removeGUI(guiID: number) {
    if (!this._GUIs.has(guiID)) {
      throw new Error("A GUI with the given id was not found.");
    }
    if (this._currentGUI == this._GUIs.get(guiID)) {
      throw new Error("The GUI you want to remove is now set as a current GUI. Remove current GUI first.");
    }

    this._GUIs.delete(guiID);
  }

  setCurrentGUI(guiID: number) {
    if (!this._GUIs.has(guiID)) {
      throw new Error("GUIs array does not include the given gui.");
    }

    const gui = this._GUIs.get(guiID)!;
    this._currentGUI = gui;
    // This stupid thing must be done to refresh scene cursor
    gui.isCursorHidden = gui.isCursorHidden;
  }

  removeCurrentGUI() {
    this._currentGUI = null;
  }

  setMainCamera(camera: Camera, renderWidth: number, renderHeight: number) {
    this._mainCamera = camera;
    this.initProjection(renderWidth, renderHeight);
  }

  initProjection(renderWidth: number, renderHeight: number): void {
    const NEAR = 0.1;
    const FAR = 1000;

    const aspectRatio = renderHeight / renderWidth;

    Matrix.makeProjection(this.projMatrix, this.mainCamera!.fov, aspectRatio, NEAR, FAR);
  }

  addGameObject(gameObject: GameObject): number {
    this.gameObjects.set(gameObject.id, gameObject);
    gameObject.loadMesh();
    return gameObject.id;
  }

  removeGameObject(gameObjectID: number): void {
    this.gameObjects.delete(gameObjectID);

    for (const [key, value] of this._overlaps) {
      if ((value as Overlap).obj1.id == gameObjectID || (value as Overlap).obj2.id == gameObjectID) {
        this._overlaps.delete(key);
      }
    }
  }

  animatedObjectDestruction(gameObjectID: number) {
    const gameObject = this.gameObjects.get(gameObjectID);
    if (!gameObject) throw new Error("No objects with this id");
    const positionTuple: Vec3DTuple = [gameObject.position.x, gameObject.position.y, gameObject.position.z];

    const velocities = [
      { x: -4, y: 10, z: 0 },
      { x: -2, y: 9, z: 2 },
      { x: 0, y: 8, z: 4 },
      { x: 2, y: 8, z: -4 },
      { x: 4, y: 10, z: -2 },
    ];

    const cubes = [...Array(5)].map((_, i) => {
      // between 0.2 and 0.6
      const randomScale = [...Array(3)].map(() => Math.random() * 0.4 + 0.2) as Vec3DTuple;
      // between 0 and 1.5
      const randomRotation = [...Array(3)].map(() => Math.random() * 1.5) as Vec3DTuple;

      const cube = new PhysicalGameObject("objects/cube_wire.obj", {
        position: positionTuple,
        size: randomScale,
        velocity: velocities[i],
      });
      cube.Update = (deltaTime) => {
        cube.velocity.x -= cube.velocity.x * 0.9 * deltaTime;
        cube.velocity.y -= 5 * deltaTime;
        cube.velocity.z -= cube.velocity.z * 0.9 * deltaTime;
        cube.rotate(
          randomRotation[0] * deltaTime,
          randomRotation[1] * deltaTime,
          randomRotation[2] * deltaTime
        );
      };
      return this.addGameObject(cube);
    });

    this.removeGameObject(gameObjectID);
    setTimeout(() => cubes.forEach((cubeID) => this.removeGameObject(cubeID)), 4500);
  }
}
