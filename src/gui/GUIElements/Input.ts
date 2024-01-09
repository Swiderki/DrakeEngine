import { Clickable } from "./Clickable";
import { GUIText } from "./GUIText";
import GuiElement from "./GuiElement";

export class Input extends GUIText implements GuiElement, Clickable {
    override position: { x: number; y: number } = { x: 0, y: 0 };
    private canvas: HTMLCanvasElement;
    isFocused: boolean = false;
    private predefinedWidth: number;
    private predefinedHeight: number;
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
        } = { top: 0, bottom: 0, left: 0, right: 0 }; 

    constructor(
        text: string,
        fontSize: number,
        fontFamily: string,
        color: string,
        fontWeight: number = 400,
        canvas: HTMLCanvasElement,
        predefiniedHeight: number,
        predefinedWidth: number

    ) {
        super(text, fontSize, fontFamily, color, fontWeight);
        this.predefinedHeight = predefiniedHeight
        this.predefinedWidth = predefinedWidth
        this.canvas = canvas;
        const textHeight = this.fontSize; // Approximation of text height
        const totalVerticalPadding = this.predefinedHeight - textHeight;
        this.padding.top = totalVerticalPadding / 2;
        this.padding.bottom = totalVerticalPadding / 2;
        const textWidth = 100; // Adjust this value based on your requirements
        this.padding.left = (this.predefinedWidth - textWidth) / 2;
        this.padding.right = this.padding.left;
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    override render(ctx: CanvasRenderingContext2D) {
        ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
        const textMetrics = ctx.measureText(this.text);
        const textWidth = textMetrics.width;

        // Check if the text exceeds the predefined width
        if (textWidth > this.predefinedWidth) {
            // Implement overflow hidden logic
            // For example, you could trim the text or implement a scrolling mechanism
        } else {
            ctx.fillText(
                this.text,
                this.position.x + 5,
                this.position.y + this.padding.top + this.fontSize - 5
            );
        }
        ctx.fillStyle = this.color;
        // ctx.fillText(
        //     this.text,
        //     this.position.x + this.padding.left,
        //     this.position.y + this.padding.top + this.height
        // );

        const borderBox = {
            left: this.position.x,
            top: this.position.y,
            right: this.position.x + this.predefinedWidth,
            bottom: this.position.y + this.predefinedHeight
        };

        // Left 
        this.drawLine(
            ctx,
            { x: borderBox.left, y: borderBox.top },
            { x: borderBox.left, y: borderBox.bottom },
            this.border.left.color,
            this.border.left.width
        );

        // Right 
        this.drawLine(
            ctx,
            { x: borderBox.right, y: borderBox.top },
            { x: borderBox.right, y: borderBox.bottom },
            this.border.right.color,
            this.border.right.width
        );

        // Top 
        this.drawLine(
            ctx,
            { x: borderBox.left, y: borderBox.top },
            { x: borderBox.right, y: borderBox.top },
            this.border.top.color,
            this.border.top.width
        );

        // Bottom 
        this.drawLine(
            ctx,
            { x: borderBox.left, y: borderBox.bottom },
            { x: borderBox.right, y: borderBox.bottom },
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
        console.log('clicked');
    }
    onClickOutside(): void {
        this.isFocused = false;
    }

    onHover(): void { }
}