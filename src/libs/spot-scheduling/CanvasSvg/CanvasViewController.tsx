// @ts-nocheck
import React from 'react';
import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';
import clx from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';

import Popover from '@material-ui/core/Popover';
import CanvasSvg from './CanvasSvg';
import CanvasSvgDisplayOnly from './CanvasSvgDisplayOnly';
import { CanvasElement } from './tools/BaseClasses/Base.tool';
import { MaterialStyleType } from '../../../utils/types';
import {
  CanvasComponentClasses,
  CanvasSelectableToolStrategy,
  CanvasSelectableToolsEnum,
  CANVAS_SELECTABLE_TOOLS,
} from './tools/CanvasStrategy';
import CanvasScreenComponent from './tools/Screen/CanvasScreen.component';
import CanvasTeacherComponent from './tools/Teacher/CanvasTeacher.component';
import CanvasZoomButtons from './CanvasZoomButtons.component';
import BeautifierForm from './tools/Beautifier/BeautifierForm.component';
import { SpotType } from '../types';
import { DEFAULT_SPOT_TYPE_ID } from '../utils';

interface OwnProps {
  elements: CanvasElement<any>[];
  selectedTool: CanvasSelectableToolsEnum;
  strokeColor?: string;
  fillColor?: string;
  wallStrokeColor?: string;
  wallFillColor?: string;
  onElementsChange: (elements: CanvasElement<any>[]) => void;
  selectedElement?: CanvasElement<any>;
  onChangeSelectedElement: (element: CanvasElement<any>) => void;
  getAsset: (identifier: string) => string;
  onSelectElement: (element: CanvasElement<any>) => void;
  disabledEdit?: boolean;
  showGrid: boolean;
  coach?: any;
  coachHeight: number;
  spotType?: number;
  spotTypes: SpotType[];
  isBoutiqueDisplay: boolean;
  isMobile?: boolean;
  onMouseOverSpot?: (spot: CanvasElement<any>) => void;
}

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class CanvasViewController extends React.PureComponent<Props> {
  cursorId = `canvas-cursor-${Date.now()}`;

  svgId = '';

  svgFunction: {
    centerSvg: (params: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
    }) => void | null;
    zoomIn: () => void;
    zoomOut: () => void;
  } = {};

  constructor(props: Props) {
    super(props);

    CanvasScreenComponent.label = props.t('toolsMenu.screen');
    CanvasTeacherComponent.label = props.t('toolsMenu.teacher');

    this.state = {
      isUnsafeZone: false,
      openBeautifyPopover: false,
      anchorEl: null,
      clickedElement: null,
    };

    this.anchorRef = React.createRef();
  }

  get tool() {
    if (!this.props.selectedTool) {
      return undefined;
    }

    return CanvasSelectableToolStrategy[this.props.selectedTool];
  }

  componentDidMount() {
    this.centerAccordingToElementBoundaries();
  }

  centerAccordingToElementBoundaries = () => {
    if (
      this.svgFunction.centerSvg &&
      this.props.elements &&
      this.props.elements.length
    ) {
      let minX = 4000;
      let minY = 4000;
      let maxX = 0;
      let maxY = 0;
      this.props.elements.forEach((element) => {
        const tool = CanvasSelectableToolStrategy[element.type];
        if (tool?.getBoundaries) {
          const boundaries = tool.getBoundaries(element);
          if (boundaries.minX < minX) {
            minX = boundaries.minX;
          }
          if (boundaries.minY < minY) {
            minY = boundaries.minY;
          }
          if (boundaries.maxX > maxX) {
            maxX = boundaries.maxX;
          }
          if (boundaries.maxY > maxY) {
            maxY = boundaries.maxY;
          }
        }
      });
      this.svgFunction.centerSvg({
        minX,
        minY,
        maxX,
        maxY,
      });
    }
  };

  zoomIn = () => {
    this.svgFunction.zoomIn && this.svgFunction.zoomIn();
  };

  zoomOut = () => {
    this.svgFunction.zoomOut && this.svgFunction.zoomOut();
  };

  onSvgClick = (x: number, y: number, mouseEvent: any) => {
    if (this.tool && this.tool.onClick) {
      const elements = this.tool.onClick(
        {
          x,
          y,
          elements: this.props.elements,
          settings: {
            fillColor: this.props.fillColor,
            strokeColor: this.props.strokeColor,
            wallFillColor: this.props.wallFillColor,
            wallStrokeColor: this.props.wallStrokeColor,
          },
          mouseEvent,
        },
        this.props.spotTypeId,
        this.props.coachHeight,
      );
      elements && this.props.onElementsChange(elements);
    }
  };

  onSvgMouseMove = (
    x: number,
    y: number,
    absoluteX: number,
    absoluteY: number,
    mouseEvent: any,
  ) => {
    const cursor = document.getElementById(this.cursorId);
    if (cursor) {
      cursor.style.position = 'absolute';
      cursor.style.left = `${absoluteX}px`;
      cursor.style.top = `${absoluteY}px`;
      cursor.style.zIndex = '9999';
      cursor.style.visibility = 'visible';
    }

    if (this.tool && this.tool.onMove) {
      const elements = this.tool.onMove(
        {
          x,
          y,
          elements: this.props.elements,
          settings: {
            fillColor: this.props.fillColor,
            strokeColor: this.props.strokeColor,
            wallFillColor: this.props.wallFillColor,
            wallStrokeColor: this.props.wallStrokeColor,
          },
          mouseEvent,
        },
        this.props.spotTypeId,
      );
      elements && this.props.onElementsChange(elements);
    }
  };

  onSvgMouseOut = (mouseEvent: any) => {
    const cursor = document.getElementById(this.cursorId);
    if (cursor) {
      cursor.style.visibility = 'hidden';
    }

    if (this.tool && this.tool.onMouseOut) {
      this.tool.onMouseOut(
        {
          x: 0,
          y: 0,
          elements: this.props.elements,
          settings: {
            fillColor: this.props.fillColor,
            strokeColor: this.props.strokeColor,
            wallFillColor: this.props.wallFillColor,
            wallStrokeColor: this.props.wallStrokeColor,
          },
          mouseEvent,
        },
        this.props.spotTypeId,
      );
    }
  };

  handleClosePopover = () => {
    this.setState({ openBeautifyPopover: false, anchorEl: null });
  };

  onMouseClickElement = (
    mouseEvent: any,
    clickedElement: CanvasElement<any>,
  ) => {
    if (this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.spot_selector) {
      this.props.onSelectElement(clickedElement);
      return;
    }
    if (this.props.selectedTool === CANVAS_SELECTABLE_TOOLS.beautifier) {
      mouseEvent.persist();
      this.setState((prevState) => ({
        openBeautifyPopover: !prevState.openBeautifyPopover,
        anchorEl: mouseEvent.target,
        clickedElement,
      }));
      return;
    }

    if (this.tool && this.tool.onClickElement) {
      const elements = this.tool.onClickElement({
        elements: this.props.elements,
        clickedElement,
        mouseEvent,
        svgId: this.svgId,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onSubmitBeautifier = (values: any) => {
    const canvasElement = this.state.clickedElement;

    const newElements = [
      ...this.props.elements.filter((ele) => ele.id !== canvasElement.id),
      {
        ...canvasElement,
        data: {
          ...canvasElement.data,
          ...values,
        },
      },
    ];
    this.props.onElementsChange(newElements);
    this.setState(() => ({
      openBeautifyPopover: false,
      anchorEl: null,
      clickedElement: null,
    }));
  };

  onMouseOverElement = (
    mouseEvent: any,
    clickedElement: CanvasElement<any>,
  ) => {
    clickedElement.type === CANVAS_SELECTABLE_TOOLS.spot &&
      this.props.onMouseOverSpot?.(clickedElement);
    if (this.tool && this.tool.onMouseOverElement) {
      const elements = this.tool.onMouseOverElement({
        elements: this.props.elements,
        clickedElement,
        mouseEvent,
        svgId: this.svgId,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onMouseOutElement = (mouseEvent: any, clickedElement: CanvasElement<any>) => {
    if (this.tool && this.tool.onMouseOutElement) {
      const elements = this.tool.onMouseOutElement({
        elements: this.props.elements,
        clickedElement,
        mouseEvent,
        svgId: this.svgId,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onMouseDownElement = (
    mouseEvent: any,
    clickedElement: CanvasElement<any>,
  ) => {
    if (this.tool && this.tool.onMouseDownElement) {
      const elements = this.tool.onMouseDownElement({
        elements: this.props.elements,
        clickedElement,
        mouseEvent,
        svgId: this.svgId,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onMouseUpElement = (mouseEvent: any, clickedElement: CanvasElement<any>) => {
    if (this.tool && this.tool.onMouseUpElement) {
      const elements = this.tool.onMouseUpElement({
        elements: this.props.elements,
        clickedElement,
        mouseEvent,
        svgId: this.svgId,
      });
      elements && this.props.onElementsChange(elements);
    }
  };

  onSvgId = (svgId: string) => {
    this.svgId = svgId;
  };

  registerSvgFunctions = (params: any) => {
    this.svgFunction = params;
  };

  /**
   * Render elements and draft
   * Define the z-axis order between drawable elements
   */
  renderElements = () => {
    const elementAndDraft: {
      element?: CanvasElement<any>;
      draftType?: any;
    }[] = [];

    this.props.elements.forEach((el) => {
      elementAndDraft.push({ element: el });
    });

    // The below seems unnecessary thus for the new version of the display we
    // do not include these element (marketplace user-space, this is kept for clureprint editor)
    !this.props.isBoutiqueDisplay &&
      Object.keys(CanvasSelectableToolStrategy).forEach((key) => {
        const Component = CanvasComponentClasses[key];

        if (Component) {
          elementAndDraft.push({ draftType: key });
        }
      });

    const orderedElementsAndDraft = elementAndDraft.sort((a, b) => {
      const A = a.draftType
        ? CanvasComponentClasses[a.draftType]
        : CanvasComponentClasses[a.element.type];
      const B = b.draftType
        ? CanvasComponentClasses[b.draftType]
        : CanvasComponentClasses[b.element.type];

      return A.zIndex - B.zIndex;
    });

    return orderedElementsAndDraft.map((elementOrDraft) => {
      if (elementOrDraft.draftType) {
        const DraftComponent = CanvasComponentClasses[elementOrDraft.draftType];
        // @ts-ignore
        const tool = CanvasSelectableToolStrategy[elementOrDraft.draftType];

        if (this.state.isUnsafeZone) {
          return null;
        }

        if (elementOrDraft.draftType === 'spotCustomized') {
          return (this.props.spotTypes ?? []).map((spotType) => {
            return (
              <DraftComponent
                key={`spot-${spotType?.id}`}
                getAsset={this.props.getAsset}
                id={`spot-${spotType?.id}`}
                spotType={spotType}
              />
            );
          });
        }

        if (this.props.selectedTool !== elementOrDraft.draftType) {
          return null;
        }

        return (
          <DraftComponent
            key={tool.draftId}
            coachHeight={this.props.coachHeight}
            getAsset={this.props.getAsset}
            id={tool.draftId}
          />
        );
      }

      if (elementOrDraft.element) {
        const { element } = elementOrDraft;
        const Component = CanvasComponentClasses[elementOrDraft.element.type];

        if (Component || element.data.asset_identifier) {
          return (
            <Component
              key={element.id}
              getAsset={this.props.getAsset}
              id={element.id}
              onClick={(evt: any) => this.onMouseClickElement(evt, element)}
              onMouseDown={(evt: any) => this.onMouseDownElement(evt, element)}
              onMouseOut={(evt: any) => this.onMouseOutElement(evt, element)}
              onMouseOver={(evt: any) => this.onMouseOverElement(evt, element)}
              onMouseUp={(evt: any) => this.onMouseUpElement(evt, element)}
              {...element.data}
              coach={this.props.coach}
              coachHeight={this.props.coachHeight}
              selectingSpot={this.props?.selectingSpot}
              spotType={
                this.props?.spotTypes?.filter(
                  (spotType) =>
                    spotType.id ===
                    (element?.data?.spotTypeId || DEFAULT_SPOT_TYPE_ID),
                )[0] || null
              }
            />
          );
        }
      }
      return null;
    });
  };

  renderCursor = () => {
    if (this.tool && this.tool.renderCursor) {
      return this.tool.renderCursor();
    }
    return null;
  };

  render() {
    const { classes } = this.props;
    return (
      <div
        className={clx(classes.relativeContainer, {
          [classes.noCursor]: this.tool && this.tool.hideNativeCursor,
        })}
      >
        {this.props.isBoutiqueDisplay ? (
          <CanvasSvgDisplayOnly>{this.renderElements()}</CanvasSvgDisplayOnly>
        ) : (
          <CanvasSvg
            ref={this.anchorRef}
            disabledEdit={this.props.disabledEdit}
            enablePan={
              !this.props.isBoutiqueDisplay &&
              [
                CANVAS_SELECTABLE_TOOLS.hand,
                CANVAS_SELECTABLE_TOOLS.spot_selector,
              ].includes(this.props.selectedTool)
            }
            onClick={this.onSvgClick}
            onEnterUnsafeZone={() => this.setState({ isUnsafeZone: true })}
            onLeaveUnsafeZone={() => this.setState({ isUnsafeZone: false })}
            onMouseMove={this.onSvgMouseMove}
            onMouseOut={this.onSvgMouseOut}
            onSvgId={this.onSvgId}
            preventResize={this.props.isBoutiqueDisplay && this.props.isMobile}
            registerFunction={this.registerSvgFunctions}
            showGrid={this.props.showGrid}
            useFullSizeContainer={!!this.props.isBoutiqueDisplay}
          >
            {this.renderElements()}
          </CanvasSvg>
        )}
        <Popover
          anchorEl={this.state.anchorEl}
          anchorOrigin="right"
          onClose={this.handleClosePopover}
          open={
            !!this.state.anchorEl &&
            this.state.openBeautifyPopover &&
            !!this.state.clickedElement
          }
        >
          <BeautifierForm
            canvasElement={this.state.clickedElement}
            onSubmit={this.onSubmitBeautifier}
            spotTypes={this.props.spotTypes}
          />
        </Popover>
        <div className={classes.cursor} id={this.cursorId}>
          {this.renderCursor()}
        </div>

        {!this.props.isBoutiqueDisplay && (
          <CanvasZoomButtons
            onClickCenter={
              this.props.disabledEdit
                ? this.centerAccordingToElementBoundaries
                : undefined
            }
            onClickZoomIn={this.zoomIn}
            onClickZoomOut={this.zoomOut}
          />
        )}
      </div>
    );
  }
}

const styles = () => ({
  relativeContainer: {
    display: 'flex',
    flex: 1,
    position: 'relative',
  },
  crosshairCursor: {
    cursor: 'crosshair',
  },
  cursor: {
    pointerEvents: 'none',
  },
  noCursor: {
    cursor: 'none',
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['spotScheduling']),
)(CanvasViewController);
