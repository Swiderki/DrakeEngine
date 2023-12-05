import Camera from "./entities/Camera";
import IdGenerator from "./util/idGenerator";
import { Matrix } from "./util/math";

export default class Scene {
  private idGenerator = new IdGenerator();
  private _gameObjects: Map<number, GameObject> = new Map();
  protected _mainCamera: Camera | undefined;
  private _projMatrix: Mat4x4 = Matrix.zeros();

  width: number;
  height: number;

  // It is good to add more cameras in the future to switch them
  get sceneCamera() {
    if (this._mainCamera == undefined) return null;
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
    mesh.loadMesh()
    return meshId;
  }
} 