import Scene from "./Scene";
import IdGenerator from "./util/idGenerator";
import { Matrix, Vector } from "./util/math";

export default class Engine {
  private penultimateFrameEndTime: number = 0;
  private prevFrameEndTime: number = 0;
  private _deltaTime: number = 0;
  private _frameNumber: number = 0;
  private _currentScene: Scene | undefined;
  private _scenes: Map<number, Scene> = new Map();
  private _idGenerator = new IdGenerator();

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private fpsDisplay: HTMLElement | null = null;

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  // added canvas getter
  get getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
  get scenes(): Map<number, Scene> {
    return this._scenes;
  }
  get idGenerator(): IdGenerator {
    return this._idGenerator;
  }
  get currentScene() {
    if (this._currentScene == undefined)
      throw new Error(
        "There is not a scene to get. You must set current scene first."
      );
    return this._currentScene;
  }

  /** The interval in seconds from the last frame to the current one */
  get deltaTime() { return this._deltaTime; } // prettier-ignore
  get frameNumber() { return this._frameNumber; } // prettier-ignore

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error(
        "ctx identifier is not supported, or the canvas has already been set to a different ctx mode"
      );
    this.ctx = ctx;
  }
  
  // Main methods - used to interact with engine's workflow directly

  addScene(scene: Scene): number {
    const sceneId = this.idGenerator.id;
    this._scenes.set(sceneId, scene);
    return sceneId;
  }

  removeScene(sceneId: number) {
    if (!this._scenes.has(sceneId))
      throw new Error("A scene with the given id was not found.");
    if (!this._currentScene != undefined)
      throw new Error(
        "The scene you want to remove is now set as a current scene. Remove current scene first."
      );
    this._scenes.delete(sceneId);
  }

  removeCurrentScene() {
    this._currentScene = undefined;
  }

  setCurrentScene(sceneId: number) {
    if (!this._scenes.has(sceneId))
      throw new Error("Scenes array does not include the given scene.");

    this._currentScene = this._scenes.get(sceneId)!;
    this._currentScene.initProjection();
  }

  private async _CoreStart(): Promise<void> {
    this.fpsDisplay = document.getElementById("fps");
    if (this.fpsDisplay) {
      this.fpsDisplay.style.position = "fixed";
      this.fpsDisplay.style.top = "0";
      this.fpsDisplay.style.color = "white";
    }
  }

  /** Gets called once the program starts */
  Start(): void {}

  private _CoreUpdate(lastFrameEnd: number, frameNumber: number = 0): void {
    // generate last rendered frame
    this.clearScreen();
    this.render();

    // prepare for next frame render
    this.penultimateFrameEndTime = this.prevFrameEndTime;
    this.prevFrameEndTime = lastFrameEnd;
    // divide difference by 1000 to express delta in seconds not miliseconds
    this._deltaTime =
      (this.prevFrameEndTime - this.penultimateFrameEndTime) / 1000;
    this._frameNumber = frameNumber;

    this.Update();

    requestAnimationFrame((renderTime) => {
      if (this.fpsDisplay && frameNumber % 10 === 0)
        this.fpsDisplay.textContent =
          Math.floor(1000 / (renderTime - lastFrameEnd)) + " FPS";
      this._CoreUpdate(renderTime, ++frameNumber);
    });
  }

  /** Gets called every frame */
  Update(): void {}

  // Utility methods

  async run(): Promise<void> {
    await this._CoreStart();
    this.Start();
    this._CoreUpdate(0);
  }

  setResolution(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this._scenes.forEach((sc) => {
      sc.width = width;
      sc.height = height;
    });

    if (this._currentScene) this._currentScene.initProjection();
  }

  clearScreen(color: string = "#000"): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawTriangle(triangle: Triangle): void {
    this.ctx.beginPath();
    this.ctx.moveTo(triangle[0].x, triangle[0].y);
    this.ctx.lineTo(triangle[1].x, triangle[1].y);
    this.ctx.moveTo(triangle[1].x, triangle[1].y);
    this.ctx.lineTo(triangle[2].x, triangle[2].y);
    this.ctx.closePath();

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "#fff";
    this.ctx.stroke();
  }

  private render(): void {
    if (
      this._currentScene == undefined ||
      this._currentScene.sceneCamera == null
    )
      return;

    let matWorld = Matrix.makeTranslation(0, 0, 0);

    const targetDir = Vector.add(
      this._currentScene.sceneCamera.position,
      this._currentScene.sceneCamera.lookDir
    );

    const matCamera = Matrix.lookAt(
      this._currentScene.sceneCamera.position,
      targetDir,
      { x: 0, y: 1, z: 0 }
    );
    const matView = Matrix.quickInverse(matCamera);

    for (const obj of this._currentScene.gameObjects.values()) {
      for (const triangle of obj.mesh) {
        const finalProjection: Triangle = Array(3) as Triangle;

        for (let i = 0; i < 3; i++) {
          const vertexTransformed = Matrix.multiplyVector(matWorld, {
            ...triangle[i],
            w: 1,
          });

          const vertexViewed = Matrix.multiplyVector(
            matView,
            vertexTransformed
          );

          const vertexProjected = Matrix.multiplyVector(
            this._currentScene.projMatrix,
            vertexViewed
          );

          const vertexNormalized = Vector.divide(
            vertexProjected,
            vertexProjected.w
          );

          const vertexScaled = Vector.add(vertexNormalized, {
            x: 1,
            y: 1,
            z: 0,
          });

          vertexScaled.x *= 0.5 * this.canvas.width;
          vertexScaled.y *= 0.5 * this.canvas.height;

          finalProjection[i] = vertexScaled;
        }

        this.drawTriangle(finalProjection);
      }
    }
  }
}
