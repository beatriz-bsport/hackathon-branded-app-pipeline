// ========== CADENCE STEP CARD SIZES ==========

export const CARD_MIN_WIDTH = '200px';
export const CARD_MAX_WIDTH = '280px';
export const CARD_MIN_HEIGHT = '72px';
export const CARD_HEIGHT_IF_EMPTY = '80px';

export const HEADER_MIN_HEIGHT = '64px';
export const HEADER_FONT_SIZE = '16px';
export const HEADER_ICON_SIZE = '38px';
export const HEADER_MAX_WIDTH = '212px';

export const CONTENT_MIN_HEIGHT = '40px';
export const CONTENT_FONT_SIZE = '11px';

// ========== CADENCE CHIP SIZES ==========

export const CADENCE_CHIP_MAX_SIZE = '176px';

// ========== CADENCE HANDLE STYLE ==========

const CADENCE_STEP_HANDLE_STYLE = {
  background: '#FFF',
  width: '10px',
  height: '10px',
  border: '2px solid #046DC8',
  boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.08)',
};

export const LEFT_HANDLE_STYLE = {
  ...CADENCE_STEP_HANDLE_STYLE,
  left: '-10px',
};

export const RIGHT_HANDLE_STYLE = {
  ...CADENCE_STEP_HANDLE_STYLE,
  right: '-10px',
};

export enum HandleTypeChoices {
  SOURCE = 'source',
  TARGET = 'target',
}

// ========== CADENCE STEP POSITIONS ==========

export const DEFAULT_X_FOR_ENTRYSTEP = 0;
export const DEFAULT_X_FOR_TRIGGER = 400;
export const DEFAULT_X_FOR_INNERSTEP = 800;
export const DEFAULT_X_FOR_EXIT = 1200;

// ========== CADENCE BUBBLES ==========

export const CADENCE_BUBBLE_HEADER_FONT_SIZE = '20px';
export const CADENCE_BUBBLE_WIDTH = '470px';
