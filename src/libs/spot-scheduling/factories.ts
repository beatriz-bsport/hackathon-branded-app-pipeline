// @ts-nocheck
import faker from 'faker';
import { CanvasSelectableToolsEnum } from '#libs/spot-scheduling/CanvasSvg/tools/CanvasStrategy';
import { RoomBlueprint } from './types';

faker.locale = 'fr';

const canvasElementTypes: CanvasSelectableToolsEnum[] = [
  'eraser',
  'line',
  'rect',
  'spot',
  'pointer',
  'hand',
  'rotation',
  'teacher',
  'screen',
  'door',
  'spot_selector',
  'spot',
];

const _canvasFactory = (canvasElementCount: number) => {
  const canvasElements = new Array(canvasElementCount).fill(0).map(() => {
    const canvasElement = {
      id: Math.floor(Math.random() * 1000).toString(),
      type: canvasElementTypes[
        Math.ceil(Math.random() * canvasElementTypes.length)
      ],
      data: {
        height: Math.floor(Math.random() * 500),
        stroke: 'black',
        width: Math.floor(Math.random() * 1000),
        x: Math.floor(Math.random() * 350),
        y: Math.floor(Math.random() * 350),
      },
    };
    return canvasElement;
  });

  return {
    coachHeight: 1,
    elements: canvasElements,
  };
};

export const roomBlueprintFactory = (
  establishmentId?: number,
): Partial<RoomBlueprint> => {
  return {
    id: Math.floor(Math.random() * 1000),
    name: faker.random.words(2),
    establishment: establishmentId ?? Math.floor(Math.random() * 1000),
    disabled: false,
    company: Math.floor(Math.random() * 1000),
    canvas: _canvasFactory(50),
  };
};

export const roomBlueprintListFactory = (
  count: number,
  establishmentId?: number,
): Partial<RoomBlueprint>[] => {
  const blueprintItemsList = new Array(count).fill(0);
  return blueprintItemsList.map(() => roomBlueprintFactory(establishmentId));
};
