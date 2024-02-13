// src/behavior
import Overlap from "./behavior/Overlap";

// src/entities
import Camera from "./entities/Camera";
import GameObject from "./entities/game-objects/GameObject";
import PhysicalGameObject from "./entities/game-objects/PhysicalGameObject";
import Cube from "./entities/game-objects/built-in/Cube";
import Sphere from "./entities/game-objects/built-in/Sphere";
import Piramide from "./entities/game-objects/built-in/Piramide";

// src/gui
import GUI from "./gui/GUI";
import Button from "./gui/GUIElements/Button";
import GUIText from "./gui/GUIElements/GUIText";
import Icon from "./gui/GUIElements/Icon";
import Input from "./gui/GUIElements/Input";

// src/util
import { parseObj, readObjFile } from "./util/fs";
import IDGenerator from "./util/IDGenerator";
import isClickable from "./util/isClickable";
import { Vector, Matrix, transpose } from "./util/math";
import { QuaternionUtils } from "./util/quaternions";

// src/
import Engine from "./Engine";
import Scene from "./Scene";

// types/
import type { Clickable, GUIDirectionalProperty, GUIElement } from "@/types/gui";
import type {
  Line3D,
  Line4D,
  LineVerteciesIndexes,
  Mat4x4,
  Rotation3D,
  Rotation3DTuple,
  Vec2D,
  Vec3D,
  Vec3DTuple,
  Vec4D,
} from "@/types/math";

export default {
  Engine,
  Cube,
  PhysicalGameObject,
  Sphere,
  Piramide,
  GameObject,
  Overlap,
  Camera,
  Scene,
  GUI,
  Button,
  GUIText,
  Icon,
  Input,
  isClickable,
  Vector,
  Matrix,
  QuaternionUtils,
  parseObj,
  readObjFile,
  transpose,
  IDGenerator,
};

export {
  Engine,
  Cube,
  PhysicalGameObject,
  Sphere,
  Piramide,
  GameObject,
  Camera,
  Scene,
  GUI,
  Overlap,
  Button,
  Vector,
  Matrix,
  GUIText,
  Icon,
  Input,
  isClickable,
  QuaternionUtils,
  parseObj,
  readObjFile,
  transpose,
  IDGenerator,
};

export type {
  Clickable,
  GUIDirectionalProperty,
  GUIElement,
  Line3D,
  Line4D,
  LineVerteciesIndexes,
  Mat4x4,
  Rotation3D,
  Rotation3DTuple,
  Vec2D,
  Vec3D,
  Vec3DTuple,
  Vec4D,
};
