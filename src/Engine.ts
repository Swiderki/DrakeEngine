import Camera from "./entities/Camera";
import IdGenerator from "./util/idGenerator";
import { Matrix, Vector } from "./util/math";

export default class Engine {
  private idGenerator = new IdGenerator();
  private gameObjects: Map<number, GameObject> = new Map();
  protected mainCamera: Camera;
  private projMatrix: Mat4x4 = Matrix.zeros();

  private penultimateFrameEndTime: number = 0;
  private prevFrameEndTime: number = 0;
  private _deltaTime: number = 0;
  private _frameNumber: number = 0;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private fpsDisplay: HTMLElement | null = null;

  /** The interval in seconds from the last frame to the current one */
  get deltaTime() { return this._deltaTime; } // prettier-ignore
  get frameNumber() { return this._frameNumber; } // prettier-ignore

  constructor(canvas: HTMLCanvasElement, camera: Camera) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error(
        "ctx identifier is not supported, or the canvas has already been set to a different ctx mode"
      );
    this.ctx = ctx;
    this.mainCamera = camera;
  }

  // Main methods - used to interact with engine's workflow directly

  private async _CoreStart(): Promise<void> {
    for (const obj of this.gameObjects.values()) await obj.loadMesh();

    this.fpsDisplay = document.getElementById("fps");
    if (this.fpsDisplay) {
      this.fpsDisplay.style.position = "fixed";
      this.fpsDisplay.style.top = "0";
      this.fpsDisplay.style.color = "white";
    }

    this.initProjection();
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
    this._deltaTime = (this.prevFrameEndTime - this.penultimateFrameEndTime) / 1000;
    this._frameNumber = frameNumber;

    this.Update();

    requestAnimationFrame((renderTime) => {
      if (this.fpsDisplay && frameNumber % 10 === 0)
        this.fpsDisplay.textContent = Math.floor(1000 / (renderTime - lastFrameEnd)) + " FPS";
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
    this.initProjection();
  }

  clearScreen(color: string = "#000"): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  addSceneMesh(mesh: GameObject): number {
    const meshId = this.idGenerator.id;
    this.gameObjects.set(meshId, mesh);
    return meshId;
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

  private initProjection(): void {
    const NEAR = 0.1;
    const FAR = 1000;

    const aspectRatio = this.canvas.height / this.canvas.width;

    Matrix.makeProjection(this.projMatrix, this.mainCamera.fov, aspectRatio, NEAR, FAR);
  }

  private render(): void {
    let matWorld = Matrix.makeTranslation(0, 0, 0);

    const targetDir = Vector.add(this.mainCamera.position, this.mainCamera.lookDir);

    const matCamera = Matrix.lookAt(this.mainCamera.position, targetDir, { x: 0, y: 1, z: 0 });
    const matView = Matrix.quickInverse(matCamera);

    for (const obj of this.gameObjects.values()) {
      for (const triangle of obj.mesh) {
        const finalProjection: Triangle = Array(3) as Triangle;

        for (let i = 0; i < 3; i++) {
          const vertexTransformed = Matrix.multiplyVector(matWorld, { ...triangle[i], w: 1 });

          const vertexViewed = Matrix.multiplyVector(matView, vertexTransformed);

          const vertexProjected = Matrix.multiplyVector(this.projMatrix, vertexViewed);

          const vertexNormalized = Vector.divide(vertexProjected, vertexProjected.w);

          const vertexScaled = Vector.add(vertexNormalized, { x: 1, y: 1, z: 0 });

          vertexScaled.x *= 0.5 * this.canvas.width;
          vertexScaled.y *= 0.5 * this.canvas.height;

          finalProjection[i] = vertexScaled;
        }

        this.drawTriangle(finalProjection);
      }
    }
  }
}
