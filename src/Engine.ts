import Scene from "./Scene";
import { Matrix, Vector, FrustumUtil } from "./util/math";
import isClickable from "./util/isClickable";
import PhysicalGameObject from "./entities/game-objects/PhysicalGameObject";
import { Line3D, Mat4x4 } from "@/types/math";

export default class Engine {
  private _penultimateFrameEndTime: number = 0;
  private _prevFrameEndTime: number = 0;
  private _deltaTime: number = 0;
  private _frameNumber: number = 0;
  private _currentScene: Scene | null = null;
  private _scenes: Map<number, Scene> = new Map();

  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _fpsDisplay: HTMLElement | null = null;

  get width() { return this._canvas.width; } // prettier-ignore
  get height() { return this._canvas.height; } // prettier-ignore
  get canvas(): HTMLCanvasElement { return this._canvas; } // prettier-ignore
  /** @deprecated(does not follow up convention) only for backward-compatibility */
  get getCanvas(): HTMLCanvasElement { return this._canvas; } // prettier-ignore
  get scenes(): Map<number, Scene> { return this._scenes; } // prettier-ignore
  get currentScene() {
    if (this._currentScene == null) {
      throw new Error("There is not a scene to get. You must set current scene first.");
    }
    return this._currentScene;
  }
  get mainCamera() { return this._currentScene?.mainCamera; } // prettier-ignore
  /** The interval from the last frame to the current one. Measured in seconds. */
  get deltaTime() { return this._deltaTime; } // prettier-ignore
  get frameNumber() { return this._frameNumber; } // prettier-ignore
  get ctx() { return this._ctx; } // prettier-ignore

  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error(
        "ctx identifier is not supported, or the canvas has already been set to a different ctx mode"
      );
    }
    this._ctx = ctx;
  }

  private async _BeforeStart(): Promise<void> {
    this._fpsDisplay = document.getElementById("fps");
    if (this._fpsDisplay) {
      this._fpsDisplay.style.position = "fixed";
      this._fpsDisplay.style.top = "0";
      this._fpsDisplay.style.color = "white";
    }

    // Click event
    document.addEventListener("click", (e) => {
      if (!this._currentScene || !this._currentScene.currentGUI || !this._canvas) return;

      const canvasRect = this._canvas.getBoundingClientRect();

      const clickX = e.clientX - canvasRect.left;
      const clickY = e.clientY - canvasRect.top;

      this._currentScene.currentGUI.elements.forEach((el) => {
        if (!isClickable(el)) return;

        if (el.isCoordInElement(clickX, clickY)) {
          el.onClick();
        } else {
          el.onClickOutside();
        }
      });
    });

    // Hover event
    document.addEventListener("mousemove", (e) => {
      if (!this._currentScene || !this._currentScene.currentGUI || !this._canvas) return;

      const canvasRect = this._canvas.getBoundingClientRect();

      const clickX = e.clientX - canvasRect.left;
      const clickY = e.clientY - canvasRect.top;

      this._currentScene.currentGUI.elements.forEach((el) => {
        if (!isClickable(el)) return;

        if (el.isCoordInElement(clickX, clickY)) {
          el.onHover();
        }
      });
    });
  }

  /** Gets called once the program starts */
  Start(): void {}

  private async _AfterStart(): Promise<void> {
    const objectsLoading = [...this.currentScene.gameObjects.values()].map((obj) => obj.loadMesh());

    // wait until all objects' meshes are loaded
    await Promise.all(objectsLoading);

    this.currentScene.gameObjects.forEach((gameObject) => gameObject.Start());
    this.currentScene._started = true;
  }

  private _BeforeUpdate(lastFrameEnd: number, frameNumber: number = 0): void {
    // generate last rendered frame
    this.clearScreen();
    this.render();

    // prepare for next frame render
    this._penultimateFrameEndTime = this._prevFrameEndTime;
    this._prevFrameEndTime = lastFrameEnd;
    // divide difference by 1000 to express delta in seconds not miliseconds
    this._deltaTime = (this._prevFrameEndTime - this._penultimateFrameEndTime) / 1000;

    this._frameNumber = frameNumber;
    if (this._currentScene != null) {
      this.currentScene.gameObjects.forEach((object) => {
        if (object instanceof PhysicalGameObject && object.getMesh().length) {
          object.updatePhysics(this._deltaTime);
        }
      });
      this.currentScene.overlaps.forEach((overlap) => {
        if (!overlap.enabled) return;
        if (!overlap.isHappening()) return;
        overlap.onOverlap();
      });
    }

    this.Update();
    this.currentScene.gameObjects.forEach((gameObject) => {
      if (gameObject.getMesh().length || gameObject.isHollow) {
        gameObject.Update(this.deltaTime, frameNumber);
      }
      if (this.currentScene.background) {
        this.currentScene.background.object.Update(this.deltaTime, frameNumber);
        // this.currentScene.background.repeatedObjects.forEach((obj) => obj.Update(this.deltaTime));
      }
    });

    requestAnimationFrame((renderTime) => {
      if (this._fpsDisplay && frameNumber % 10 === 0)
        this._fpsDisplay.textContent = Math.floor(1000 / (renderTime - lastFrameEnd)) + " FPS";
      this._BeforeUpdate(renderTime, ++frameNumber);
    });
  }

  /** Gets called every frame */
  Update(): void {}

  // Utility methods

  async run(): Promise<void> {
    await this._BeforeStart();
    this.Start();

    await this._AfterStart();

    this._BeforeUpdate(0);
  }

  setResolution(width: number, height: number): void {
    this._canvas.width = width;
    this._canvas.height = height;

    if (this._currentScene) this._currentScene.initProjection(this.width, this.height);
  }

  clearScreen(color: string = "#000"): void {
    this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  addScene(scene: Scene): number {
    this._scenes.set(scene.id, scene);
    return scene.id;
  }

  removeScene(sceneID: number) {
    if (!this._scenes.has(sceneID)) {
      throw new Error("A scene with the given id was not found.");
    }
    if (!this._currentScene != null) {
      throw new Error(
        "The scene you want to remove is now set as a current scene. Remove current scene first."
      );
    }
    this._scenes.delete(sceneID);
  }

  setCurrentScene(sceneID: number): void {
    if (!this._scenes.has(sceneID)) throw new Error("Scenes array does not include the given scene.");

    this._currentScene = this._scenes.get(sceneID)!;
    this._currentScene.initProjection(this.width, this.height);

    if (this._currentScene.currentGUI)
      this._currentScene.currentGUI.isCursorHidden = this._currentScene.currentGUI.isCursorHidden;
  }

  removeCurrentScene(): void {
    this._currentScene = null;
  }

  private drawLine(line: Line3D, color: string): void {
    this.ctx.beginPath();
    this.ctx.moveTo(line[0].x, line[0].y);
    this.ctx.lineTo(line[1].x, line[1].y);
    this.ctx.closePath();

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  private drawSceneBackground() {
    if (!this._currentScene?.mainCamera || !this.mainCamera || !this.currentScene.background) return;

    const BG_ROTATION_EFFECT_NORMALIZE = 100;

    const backgroundShiftAlongCamera =
      this.mainCamera.rotation.y *
      this.currentScene.background.rotationLikeCameraSpeed *
      BG_ROTATION_EFFECT_NORMALIZE;

    if (!this.currentScene.background.repeat) {
      this.currentScene.background.object.setPosition(
        this.currentScene.background.position.x - backgroundShiftAlongCamera,
        this.currentScene.background.position.y,
        0
      );
      for (const { line, color } of this.currentScene.background.object.getMesh()) {
        this.drawLine(line, color);
      }
      return;
    }

    this.currentScene.background.object.generateBoxCollider();
    const bgWidth = Math.abs(
      this.currentScene.background.object.boxCollider![0].x -
        this.currentScene.background.object.boxCollider![1].x
    );

    const originalPosition = {
      ...this.currentScene.background.object.position,
    };

    for (
      let w =
        Math.floor(backgroundShiftAlongCamera / bgWidth - this.currentScene.background.position.x) * bgWidth;
      w < this._canvas.width + backgroundShiftAlongCamera;
      w += bgWidth
    ) {
      this.currentScene.background.object.setPosition(
        w + this.currentScene.background.position.x - backgroundShiftAlongCamera,
        this.currentScene.background.position.y,
        0
      );
      for (const { line, color } of this.currentScene.background.object.getMesh()) {
        this.drawLine(line, color);
      }
    }

    this.currentScene.background.object.setPosition(
      originalPosition.x,
      originalPosition.y,
      originalPosition.z
    );
  }

  private render(): void {
    if (!this._currentScene?.mainCamera || !this.mainCamera) return;

    this.drawSceneBackground();

    const matWorld = Matrix.makeTranslation(0, 0, 0);

    const targetDir = Vector.add(
      this._currentScene.mainCamera.position,
      this._currentScene.mainCamera.lookDir
    );

    const matCamera = Matrix.lookAt(this._currentScene.mainCamera.position, targetDir, {
      x: 0,
      y: 1,
      z: 0,
    });

    const matView = Matrix.quickInverse(matCamera);

    const projectionMatrix = Matrix.zeros();
    Matrix.makeProjection(projectionMatrix, 90, 720 / 1280, 0.1, 1000);

    for (const obj of this._currentScene.gameObjects.values()) {
      if (obj.showBoxcollider) {
        for (const line of obj.getBoxColliderMesh()!) {
          // Project and render the line
          this.renderLine(line, matWorld, matView, "green");
        }
      }

      for (const { line, color } of obj.getMesh()) {
        // Project and render the line
        this.renderLine(line, matWorld, matView, color);
      }
    }

    if (this.currentScene.currentGUI) this.currentScene.currentGUI.render();
  }

  static isLineVisible(line: Line3D, matView: Mat4x4, projectionMatrix: Mat4x4): boolean {
    if (
      !FrustumUtil.isPointInFrustum(line[0], matView, projectionMatrix) &&
      !FrustumUtil.isPointInFrustum(line[1], matView, projectionMatrix)
    )
      return false;
    return true;
  }

  private renderLine(line: Line3D, matWorld: Mat4x4, matView: Mat4x4, color: string = "#fff"): void {
    if (this._currentScene == null) return;
    const finalProjection: Line3D = Array(2) as Line3D;
    for (let i = 0; i < 3; i++) {
      const vertexTransformed = Matrix.multiplyVector(matWorld, {
        ...line[i],
        w: 1,
      });

      const vertexViewed = Matrix.multiplyVector(matView, vertexTransformed);

      const vertexProjected = Matrix.multiplyVector(this._currentScene.projMatrix, vertexViewed);

      const vertexNormalized =
        vertexProjected.w !== 0 ? Vector.divide(vertexProjected, vertexProjected.w) : vertexProjected;

      const vertexScaled = Vector.add(vertexNormalized, {
        x: 1,
        y: 1,
        z: 0,
      });

      vertexScaled.x *= 0.5 * this._canvas.width;
      vertexScaled.y *= 0.5 * this._canvas.height;

      finalProjection[i] = vertexScaled;
    }
    // check line visibility
    if (!Engine.isLineVisible(line, matView, this._currentScene.projMatrix)) return;
    // clip line against the plain
    let clippedProjection = FrustumUtil.clipLineAgainstPlain(finalProjection, {
      point: { x: 0, y: 0, z: 0 },
      normal: { x: 0, y: 1, z: 0 },
    })!;
    clippedProjection = FrustumUtil.clipLineAgainstPlain(clippedProjection, {
      point: { x: 0, y: this.height - 1, z: 0 },
      normal: { x: 0, y: -1, z: 0 },
    })!;
    clippedProjection = FrustumUtil.clipLineAgainstPlain(clippedProjection, {
      point: { x: 0, y: 0, z: 0 },
      normal: { x: 1, y: 0, z: 0 },
    })!;
    clippedProjection = FrustumUtil.clipLineAgainstPlain(clippedProjection, {
      point: { x: this.height - 1, y: 0, z: 0 },
      normal: { x: -1, y: 0, z: 0 },
    })!;
    if (clippedProjection === null) return;
    this.drawLine(finalProjection, color);
  }
}
