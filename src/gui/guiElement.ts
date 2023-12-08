import GUI from "./Gui";

interface GuiElement extends GUI{
    get width(): number;
    set width(value: number);

    get height(): number;
    set height(value: number);

    get position(): { x: number, y: number };
    set position(value: { x: number, y: number });

    render(): void;
    onClick(): void;
    onHover(): void;
}

class Button extends GUI implements GuiElement{
    private _width: number = 100;
    private _height: number = 50;
    private _position: { x: number, y: number } = {x: 0, y: 0};
    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
    }

    get position(): { x: number, y: number } {
        return this._position;
    }

    set position(value: { x: number, y: number }) {
        this._position = value;
    }
    render(){
        
    }
    onClick(): void{

    }
    onHover(): void {
        
    }
}