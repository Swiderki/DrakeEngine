import { Overlap } from "./behavior/Overlap";
import Camera from "./entities/Camera";
import GameObject from "./entities/game-objects/GameObject";
import PhysicalObject from "./entities/game-objects/PhysicalObject";
import Cube from "./entities/game-objects/built-in/Cube";
import GUI from "./gui/Gui";
import IdGenerator from "./util/idGenerator";
import { Matrix } from "./util/math";

export default class Scene {
  private _gameObjects: Map<number, GameObject> = new Map();
  protected _mainCamera: Camera | null = null;
  private _projMatrix: Mat4x4 = Matrix.zeros();
  private _GUIs: Map<number, GUI> = new Map();
  private _currentGUI: GUI | null = null;
  readonly overlaps: Map<number, Overlap> = new Map();

  // prettier-ignore
  get GUIs() { return this._GUIs; }

  get currentGUI() {
    // It must return null to better usage in render.
    if (this._currentGUI == null) return null;
    return this._currentGUI;
  }

  width: number;
  height: number;

  // It is good to add more cameras in the future to switch them
  get sceneCamera() {
    if (this._mainCamera == null) return null;
    return this._mainCamera;
  }

  get gameObjects() {
    return this._gameObjects;
  }

  get projMatrix() {
    return this._projMatrix;
  }

  constructor(width: number, height: number, id: number) {
    this.width = width;
    this.height = height;
  }

  getOverlap(id: number): Overlap {
    if (!this.overlaps.has(id)) throw new Error("There's no overlap with the given id");
    return this.overlaps.get(id)!;
  }

  addOverlap(overlap: Overlap): number {
    if ([...this.overlaps.values()].includes(overlap))
      throw new Error("The given overlap is already added to the scene's overlaps.");

    const id = IdGenerator.new();

    this.overlaps.set(id, overlap);
    return id;
  }

  removeOverlap(id: number): number {
    if (!this.overlaps.has(id)) throw new Error("There's no overlap with the given id");

    this.overlaps.delete(id);
    return id;
  }

  // Main methods
  setCurrentGUI(guiId: number) {
    if (!this._GUIs.has(guiId)) throw new Error("GUIs array does not include the given gui.");

    const gui = this._GUIs.get(guiId)!;
    this._currentGUI = gui;
    // This stupid thing must be done to refresh scene cursor
    gui.hideCursor = gui.hideCursor;
  }

  removeGUI(guiId: number) {
    if (!this._GUIs.has(guiId)) throw new Error("A GUI with the given id was not found.");
    if (this._currentGUI == this._GUIs.get(guiId))
      throw new Error("The GUI you want to remove is now set as a current GUI. Remove current GUI first.");

    this._GUIs.delete(guiId);
  }

  removeCurrentGUI() {
    this._currentGUI = null;
  }

  addGUI(gui: GUI): number {
    if ([...this._GUIs.values()].includes(gui))
      throw new Error("The given gui is already added to the scene's GUIs");
    const guiId = IdGenerator.new();
    this._GUIs.set(guiId, gui);
    return guiId;
  }

  setCamera(camera: Camera) {
    this._mainCamera = camera;
    this.initProjection();
  }

  initProjection(): void {
    const NEAR = 0.1;
    const FAR = 1000;

    const aspectRatio = this.height / this.width;

    Matrix.makeProjection(this.projMatrix, this.sceneCamera!.fov, aspectRatio, NEAR, FAR);
  }

  addSceneMesh(mesh: GameObject): number {
    this.gameObjects.set(mesh.id, mesh);
    mesh.loadMesh();
    return mesh.id;
  }

  killObject(gameObjectId: number): void;
  killObject(gameObject: GameObject): void;
  killObject(objOrId: GameObject | number): void {
    if (typeof objOrId === "number") {
      this.gameObjects.delete(objOrId);
    } else {
      this.gameObjects.delete(objOrId?.id);
    }
  }

  animatedObjectDestruction(gameObject: GameObject) {
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

      const cube = new PhysicalObject("objects/cube_wire.obj", {
        position: positionTuple,
        size: randomScale,
        velocity: velocities[i],
      });
      cube.Update = (deltaTime) => {
        console.log("particles alive");
        cube.velocity.x -= cube.velocity.x * 0.9 * deltaTime;
        cube.velocity.y -= 5 * deltaTime;
        cube.velocity.z -= cube.velocity.z * 0.9 * deltaTime;
        cube.rotate(
          randomRotation[0] * deltaTime,
          randomRotation[1] * deltaTime,
          randomRotation[2] * deltaTime
        );
      };
      return this.addSceneMesh(cube);
    });

    this.killObject(gameObject);
    setTimeout(() => cubes.forEach((cubeId) => this.killObject(cubeId)), 4500);
  }
}
