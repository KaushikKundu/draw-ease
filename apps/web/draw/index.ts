import { ShapeName } from "@/app/home/[roomId]/page";
type Shape =
    | {
          type: ShapeName.Rectangle;
          x: number;
          y: number;
          width: number;
          height: number;
      }
    | {
          type: ShapeName.Circle;
          centerX: number;
          centerY: number;
          radius: number;
      }
    | {
          type: ShapeName.Line;
          startX: number;
          startY: number;
          endX: number;
          endY: number;
      }
    | {
          type: ShapeName.Eraser;
          x: number;
          y: number;
      };
let existingShapes: Shape[] = [];

export function initDraw(canvas: HTMLCanvasElement, curShape: ShapeName | null) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Failed to get canvas context");
    }

    let startX = 0;
    let startY = 0;
    let isDrawing = false;
    const mousedownHandler = (event:MouseEvent) => {
        startX = event.offsetX;
        startY = event.offsetY;
        isDrawing = true;
    }
    const mousemoveHandler = (event:MouseEvent) => {
        if (!isDrawing) return;
        ctx.strokeStyle = "black";

        clearCanvas(canvas, existingShapes, ctx);

        const currentX = event.offsetX;
        const currentY = event.offsetY;

        if (curShape === ShapeName.Rectangle) {
            const width = currentX - startX;
            const height = currentY - startY;
            ctx.strokeRect(startX, startY, width, height);
        } else if (curShape === ShapeName.Circle) {
            const centerX = (startX + currentX) / 2;
            const centerY = (startY + currentY) / 2;
            const radius =
                Math.sqrt(
                    Math.pow(currentX - startX, 2) +
                        Math.pow(currentY - startY, 2)
                ) / 2;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (curShape === ShapeName.Line) {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
        }
    }
    
    const mouseupHandler = (event:MouseEvent) => {
        isDrawing = false;
        const endX = event.offsetX;
        const endY = event.offsetY;

        if (curShape === ShapeName.Circle) {
            const centerX = (startX + endX) / 2;
            const centerY = (startY + endY) / 2;
            const radius =
                Math.sqrt(
                    Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
                ) / 2;
            existingShapes.push({
                centerX,
                centerY,
                radius,
                type: ShapeName.Circle,
            });
        } else if (curShape === ShapeName.Rectangle) {
            const width = endX - startX;
            const height = endY - startY;
            existingShapes.push({
                x: startX,
                y: startY,
                width,
                height,
                type: ShapeName.Rectangle,
            });
        } else if (curShape === ShapeName.Line) {
            existingShapes.push({
                startX,
                startY,
                endX,
                endY,
                type: ShapeName.Line,
            });
        }
       clearCanvas(canvas, existingShapes, ctx);
    }
    canvas.addEventListener("mousedown",mousedownHandler );
    canvas.addEventListener("mousemove", mousemoveHandler );
    canvas.addEventListener("mouseup", mouseupHandler);


    const clearCanvas = (
        canvas: HTMLCanvasElement,
        existingShapes: Shape[],
        ctx: CanvasRenderingContext2D
    ) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        existingShapes.forEach((shape) => {
            if (shape.type === ShapeName.Rectangle) {
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === ShapeName.Circle) {
                ctx.beginPath();
                ctx.arc(
                    shape.centerX,
                    shape.centerY,
                    shape.radius,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();
            } else if (shape.type === ShapeName.Line) {
                ctx.beginPath();
                ctx.moveTo(shape.startX, shape.startY);
                ctx.lineTo(shape.endX, shape.endY);
                ctx.stroke();
            }
        });
    };
    return () => {
        canvas.removeEventListener("mousedown", mousedownHandler);
        canvas.removeEventListener("mousemove", mousemoveHandler);
        canvas.removeEventListener("mouseup", mouseupHandler);
        
    }
}
