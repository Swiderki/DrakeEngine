import { Overlap } from "./behavior/Overlap";
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
  private overlapIdGenerator = new IdGenerator();
  private _overlaps: Map<number, Overlap> = new Map();

  // prettier-ignore
  get overlaps() { return this._overlaps };
  // prettier-ignore
  get GUIs() { return this._GUIs; }

  get currentGUI() {
    // It must return null to better usage in render.
    if (this._currentGUI == null) return null;
    return this._currentGUI;
  }

  width: number;
  height: number;

  // EXPERIMENTAL
  killObject(id: number) {
    if (!this._gameObjects.has(id)) throw new Error("There's no game object with the given id");

    const gm = this._gameObjects.get(id);

    for (let [key, value] of this._overlaps) {
      if ((value as Overlap).obj1 == gm || (value as Overlap).obj2 == gm) {
        this._overlaps.delete(key);
      }
    }

    this._gameObjects.delete(id);
  }

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

    const id = this.overlapIdGenerator.id;

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

    Matrix.makeProjection(this.projMatrix, this.sceneCamera!.fov, aspectRatio, NEAR, FAR);
  }

  addSceneMesh(mesh: GameObject): number {
    const meshId = this.idGenerator.id;
    this.gameObjects.set(meshId, mesh);
    // mesh.loadMesh();
    return meshId;
  }
}
