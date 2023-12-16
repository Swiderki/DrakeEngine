import { Clickable } from "./Clickable";
import { GUIText } from "./GUIText";
import GuiElement from "./GuiElement";

export class Input extends GUIText implements GuiElement, Clickable {
    override position: { x: number; y: number } = { x: 0, y: 0 };
    private canvas: HTMLCanvasElement;

    isFocused: boolean = false;

    border: {
        top: { color: string; width: number };
        bottom: { color: string; width: number };
        left: { color: string; width: number };
        right: { color: string; width: number };
    } = {
            top: { color: "#ff0000", width: 6 },
            bottom: { color: "#ff0000", width: 6 },
            left: { color: "#fff", width: 6 },
            right: { color: "#fff", width: 6 },
        };

    padding: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    } = {
            top: 20,
            bottom: 20,
            left: 40,
            right: 40,
        };

    constructor(
        text: string,
        fontSize: number,
        fontFamily: string,
        color: string,
        fontWeight: number = 400,
        canvas: HTMLCanvasElement,

    ) {
        super(text, fontSize, fontFamily, color, fontWeight);
        this.canvas = canvas;
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    override render(ctx: CanvasRenderingContext2D) {
        ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
        ctx.fillStyle = this.color;

        ctx.fillText(
            this.text,
            this.position.x + this.padding.left,
            this.position.y + this.padding.top + this.height
        );

        // Drawing border
        // Lines such as "+ this.width / 2" force thing like "box-sizing"

        // Left
        this.drawLine(
            ctx,
            { x: this.position.x + this.border.left.width / 2, y: this.position.y },
            {
                x: this.position.x + this.border.left.width / 2,
                y:
                    this.position.y +
                    this.height +
                    this.padding.top +
                    this.padding.bottom,
            },
            this.border.left.color,
            this.border.left.width
        );

        // Right
        this.drawLine(
            ctx,
            {
                x:
                    this.position.x +
                    this.width -
                    this.border.right.width / 2 +
                    this.padding.left +
                    this.padding.right,
                y: this.position.y,
            },
            {
                x:
                    this.position.x +
                    this.width -
                    this.border.right.width / 2 +
                    this.padding.left +
                    this.padding.right,
                y:
                    this.position.y +
                    this.height +
                    this.padding.top +
                    this.padding.bottom,
            },
            this.border.right.color,
            this.border.right.width
        );

        // Top
        this.drawLine(
            ctx,
            { x: this.position.x, y: this.position.y + this.border.top.width / 2 },
            {
                x:
                    this.position.x + this.width + this.padding.left + this.padding.right,
                y: this.position.y + this.border.top.width / 2,
            },
            this.border.top.color,
            this.border.top.width
        );

        // Bottom
        this.drawLine(
            ctx,
            {
                x: this.position.x,
                y:
                    this.position.y +
                    this.height -
                    this.border.bottom.width / 2 +
                    this.padding.top +
                    this.padding.bottom,
            },
            {
                x:
                    this.position.x + this.width + this.padding.left + this.padding.right,
                y:
                    this.position.y +
                    this.height -
                    this.border.bottom.width / 2 +
                    this.padding.top +
                    this.padding.bottom,
            },
            this.border.bottom.color,
            this.border.bottom.width
        );
    }

    private drawLine(
        ctx: CanvasRenderingContext2D,
        start: { x: number; y: number },
        end: { x: number; y: number },
        color: string,
        width: number
    ) {
        if (width == 0) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);

        ctx.strokeStyle = color;

        ctx.lineWidth = width;

        ctx.stroke();
        ctx.restore();
    }

    isCoordInElement(x: number, y: number) {
        return (
            x >= this.position.x &&
            // prettier-ignore
            x <= this.position.x + this.width + this.padding.left + this.padding.right &&
            y >= this.position.y &&
            // prettier-ignore
            y <= this.position.y + this.height + this.padding.top + this.padding.bottom
        );
    }

    handleKeyDown(event: KeyboardEvent) {
        if (!this.isFocused) return;

        if (event.key === 'Backspace') {
            this.text = this.text.slice(0, -1);
        } else if (event.key.length === 1) {
            this.text += event.key;
        }
    }


    onClick(): void {
        this.isFocused = true;
    }
    onClickOutside(): void {
        this.isFocused = false;
    }

    onHover(): void { }
}