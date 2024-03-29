import { Clickable } from "@/types/gui";

export default function isClickable(obj: any): obj is Clickable {
  return (
    obj &&
    typeof obj.onClick === "function" &&
    typeof obj.onHover === "function" &&
    typeof obj.isCoordInElement === "function"
  );
}
