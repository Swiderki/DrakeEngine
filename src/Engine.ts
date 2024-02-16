import Scene from "./Scene";
import { Matrix, Vector } from "./util/math";
import isClickable from "./util/isClickable";
import PhysicalGameObject from "./entities/game-objects/PhysicalGameObject";
import { Overlap } from ".";
import { Line3D } from "@/types/math";

export default class Engine {
  private _penultimateFrameEndTime: number = 0;
  private _prevFrameEndTime: number = 0;
  private _deltaTime: number = 0;
  private _frameNumber: number = 0;
  private _currentScene: Scene | null = null;
  private _scenes: Map<number, Scene> = new Map();

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private fpsDisplay: HTMLElement | null = null;

  get width() { return this.canvas.width; } // prettier-ignore
  get height() { return this.canvas.height; } // prettier-ignore
  get getCanvas(): HTMLCanvasElement { return this.canvas; } // prettier-ignore
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

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error(
        "ctx identifier is not supported, or the canvas has already been set to a different ctx mode"
      );
    }
    this.ctx = ctx;
  }

  private async _BeforeStart(): Promise<void> {
    this.fpsDisplay = document.getElementById("fps");
    if (this.fpsDisplay) {
      this.fpsDisplay.style.position = "fixed";
      this.fpsDisplay.style.top = "0";
      this.fpsDisplay.style.color = "white";
    }

    // Click event
    document.addEventListener("click", (e) => {
      if (!this._currentScene || !this._currentScene.currentGUI || !this.canvas) return;

      const canvasRect = this.canvas.getBoundingClientRect();

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
      if (!this._currentScene || !this._currentScene.currentGUI || !this.canvas) return;

      const canvasRect = this.canvas.getBoundingClientRect();

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
        if (object instanceof PhysicalGameObject) {
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
    this.currentScene.gameObjects.forEach((gameObject) => gameObject.Update(this.deltaTime));

    requestAnimationFrame((renderTime) => {
      if (this.fpsDisplay && frameNumber % 10 === 0)
        this.fpsDisplay.textContent = Math.floor(1000 / (renderTime - lastFrameEnd)) + " FPS";
      this._BeforeUpdate(renderTime, ++frameNumber);
    });
  }

  /** Gets called every frame */
  Update(): void {
    for (const [id, obj] of this._currentScene!.gameObjects.entries()) {
      if (obj.killed) {
        const gm = this._currentScene!.gameObjects.get(id);
        for (let [key, value] of this._currentScene!.overlaps) {
          if ((value as Overlap).obj1 == gm || (value as Overlap).obj2 == gm) {
            this._currentScene!.overlaps.delete(key);
          }
        }
        this._currentScene!.gameObjects.delete(id);
      }
    }
  }

  // Utility methods

  async run(): Promise<void> {
    await this._BeforeStart();
    await this.Start();

    this.currentScene.gameObjects.forEach((gameObject) => gameObject.Start());

    await this._AfterStart();

    this._BeforeUpdate(0);
  }

  setResolution(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;

    if (this._currentScene) this._currentScene.initProjection(this.width, this.height);
  }

  clearScreen(color: string = "#000"): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

  private render(): void {
    if (this._currentScene == null || this._currentScene.mainCamera == null) return;

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

    for (const obj of this._currentScene.gameObjects.values()) {
      if (obj.showBoxcollider) {
        for (const line of obj.getBoxColliderMesh()!) {
          const finalProjection: Line3D = Array(2) as Line3D;
          for (let i = 0; i < 3; i++) {
            const vertexTransformed = Matrix.multiplyVector(matWorld, {
              ...line[i],
              w: 1,
            });

            const vertexViewed = Matrix.multiplyVector(matView, vertexTransformed);

            const vertexProjected = Matrix.multiplyVector(this._currentScene.projMatrix, vertexViewed);

            const vertexNormalized = Vector.divide(vertexProjected, vertexProjected.w);

            const vertexScaled = Vector.add(vertexNormalized, {
              x: 1,
              y: 1,
              z: 0,
            });

            vertexScaled.x *= 0.5 * this.canvas.width;
            vertexScaled.y *= 0.5 * this.canvas.height;

            finalProjection[i] = vertexScaled;
          }

          this.drawLine(finalProjection, "#0f0");
        }
      }
      for (const { line, color } of obj.getMesh()) {
        const finalProjection: Line3D = Array(2) as Line3D;
        for (let i = 0; i < 3; i++) {
          const vertexTransformed = Matrix.multiplyVector(matWorld, {
            ...line[i],
            w: 1,
          });

          const vertexViewed = Matrix.multiplyVector(matView, vertexTransformed);

          const vertexProjected = Matrix.multiplyVector(this._currentScene.projMatrix, vertexViewed);

          const vertexNormalized = Vector.divide(vertexProjected, vertexProjected.w);

          const vertexScaled = Vector.add(vertexNormalized, {
            x: 1,
            y: 1,
            z: 0,
          });

          vertexScaled.x *= 0.5 * this.canvas.width;
          vertexScaled.y *= 0.5 * this.canvas.height;

          finalProjection[i] = vertexScaled;
        }

        this.drawLine(finalProjection, color);
      }
    }

    if (this.currentScene.currentGUI) this.currentScene.currentGUI.render();
  }
}
