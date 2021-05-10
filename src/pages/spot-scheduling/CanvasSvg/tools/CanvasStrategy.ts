import { ElementDOMController } from './BaseClasses/Base.controller';

import LineDOMController from './Line/CanvasLine.controller';
import SpotDOMController from './Spot/CanvasSpot.controller';
import RectDOMController from './Rect/CanvasRect.controller';
import TeacherDOMController from './Teacher/CanvasTeacher.controller';
import ScreenDOMController from './Screen/CanvasScreen.controller';

import CanvasLineComponent from './Line/CanvasLine.component';
import CanvasRectComponent from './Rect/CanvasRect.component';
import CanvasSpotComponent from './Spot/CanvasSpot.component';
import CanvasTeacherComponent from './Teacher/CanvasTeacher.component';
import CanvasScreenComponent from './Screen/CanvasScreen.component';

import CanvasEraserTool from './Eraser/CanvasEraser.tool';
import CanvasLineTool from './Line/CanvasLine.tool';
import CanvasRectTool from './Rect/CanvasRect.tool';
import CanvasSpotTool from './Spot/CanvasSpot.tool';
import CanvasPointerTool from './Pointer/CanvasPointer.tool';
import CanvasRotationTool from './Rotation/CanvasRotation.tool';
import CanvasTeacherTool from './Teacher/CanvasTeacher.tool';
import CanvasScreenTool from './Screen/CanvasScreen.tool';
import CanvasDoorComponent from './Door/CanvasDoor.component';
import DoorDOMController from './Door/CanvasDoor.controller';
import CanvasDoorTool from './Door/CanvasDoor.tool';

export type CanvasSelectableToolsEnum =
  | 'eraser'
  | 'line'
  | 'rect'
  | 'spot'
  | 'pointer'
  | 'rotation'
  | 'teacher'
  | 'screen'
  | 'door';

export const CANVAS_SELECTABLE_TOOLS = {
  eraser: 'eraser' as const,
  line: 'line' as const,
  rect: 'rect' as const,
  spot: 'spot' as const,
  pointer: 'pointer' as const,
  rotation: 'rotation' as const,
  teacher: 'teacher' as const,
  screen: 'screen' as const,
  door: 'door' as const,
};

export const CanvasComponentClasses: { [key: string]: any } = {
  [CANVAS_SELECTABLE_TOOLS.line]: CanvasLineComponent,
  [CANVAS_SELECTABLE_TOOLS.rect]: CanvasRectComponent,
  [CANVAS_SELECTABLE_TOOLS.spot]: CanvasSpotComponent,
  [CANVAS_SELECTABLE_TOOLS.teacher]: CanvasTeacherComponent,
  [CANVAS_SELECTABLE_TOOLS.screen]: CanvasScreenComponent,
  [CANVAS_SELECTABLE_TOOLS.door]: CanvasDoorComponent,
};

export const CanvasControllerStrategy: {
  [key: string]: ElementDOMController<any>;
} = {
  [CANVAS_SELECTABLE_TOOLS.line]: new LineDOMController(),
  [CANVAS_SELECTABLE_TOOLS.rect]: new RectDOMController(),
  [CANVAS_SELECTABLE_TOOLS.spot]: new SpotDOMController(),
  [CANVAS_SELECTABLE_TOOLS.teacher]: new TeacherDOMController(),
  [CANVAS_SELECTABLE_TOOLS.screen]: new ScreenDOMController(),
  [CANVAS_SELECTABLE_TOOLS.door]: new DoorDOMController(),
};

export const CanvasSelectableToolStrategy = {
  [CANVAS_SELECTABLE_TOOLS.eraser]: new CanvasEraserTool(),
  [CANVAS_SELECTABLE_TOOLS.line]: new CanvasLineTool(),
  [CANVAS_SELECTABLE_TOOLS.rect]: new CanvasRectTool(),
  [CANVAS_SELECTABLE_TOOLS.spot]: new CanvasSpotTool(),
  [CANVAS_SELECTABLE_TOOLS.pointer]: new CanvasPointerTool(),
  [CANVAS_SELECTABLE_TOOLS.rotation]: new CanvasRotationTool(),
  [CANVAS_SELECTABLE_TOOLS.teacher]: new CanvasTeacherTool(),
  [CANVAS_SELECTABLE_TOOLS.screen]: new CanvasScreenTool(),
  [CANVAS_SELECTABLE_TOOLS.door]: new CanvasDoorTool(),
};
