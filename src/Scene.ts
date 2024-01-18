import Camera from "./entities/Camera";
import GUI from "./gui/Gui";
import IdGenerator from "./util/idGenerator";
import { Matrix } from "./util/math";

export default class Scene {
  private idGenerator = new IdGenerator();
  private _gameObjects: Map<number, GameObject> = new Map();
  protected _mainCamera: Camera | null = null;
  private _projMatrix: Mat4x4 = Matrix.zeros();
  private _GUIs: Map<number, GUI> = new Map();
  private _currentGUI: GUI | null = null;
  private _id: number;
  // prettier-ignore
  get GUIs() { return this._GUIs; }
  get currentGUI() {
    // It must return null to better usage in render.
    if (this._currentGUI == null) return null;
    return this._currentGUI;
  }

  get id() {
    return this._id;
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
    this._id = id;
  }

  // Main methods
  setCurrentGUI(guiId: number) {
    if (!this._GUIs.has(guiId))
      throw new Error("GUIs array does not include the given gui.");

    const gui = this._GUIs.get(guiId)!;
    this._currentGUI = gui;
    // This stupid thing must be done to refresh scene cursor
    gui.hideCursor = gui.hideCursor;
  }

  removeGUI(guiId: number) {
    if (!this._GUIs.has(guiId))
      throw new Error("A GUI with the given id was not found.");
    if (this._currentGUI == this._GUIs.get(guiId))
      throw new Error(
        "The GUI you want to remove is now set as a current GUI. Remove current GUI first."
      );

    this._GUIs.delete(guiId);
  }

  removeCurrentScene() {
    this._currentGUI = null;
  }

  addGUI(gui: GUI): number {
    const guiId = this.idGenerator.id;
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

    Matrix.makeProjection(
      this.projMatrix,
      this.sceneCamera!.fov,
      aspectRatio,
      NEAR,
      FAR
    );
  }

  addSceneMesh(mesh: GameObject): number {
    const meshId = this.idGenerator.id;
    this.gameObjects.set(meshId, mesh);
    mesh.loadMesh();
    return meshId;
  }
}
