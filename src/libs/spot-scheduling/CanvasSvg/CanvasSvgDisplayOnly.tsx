import React from 'react';

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from 'react-zoom-pan-pinch';
import useParentSize from '#hooks/useParentSize';

const SVG_CANVAS_DISPLAY_ID = 'svg-canvas-display';
// https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getBBox
const CanvasSvgDisplayOnly: React.FC = ({
  children,
  containerRef,
}: {
  isMobile: boolean;
  children: SVGElement;
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  const [SVGElContainer, setSVGElContainer] =
    React.useState<SVGGraphicsElement>(null);

  const [SVGBbbox, setSVGBbbox] = React.useState('');
  const [SVGDimensions, setSVGDimensions] = React.useState({
    height: 0,
    width: 0,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width, height } = useParentSize(containerRef);

  const [isPanningDisabled, setIsPanningDisabled] = React.useState(true);
  // CDM
  React.useEffect(() => {
    window.addEventListener('resize', handleSetviewBox);
    return () => {
      window.removeEventListener('resize', handleSetviewBox);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // @ts-expect-error
    setSVGElContainer(document.getElementById(SVG_CANVAS_DISPLAY_ID));
  }, []);

  React.useEffect(() => {
    // Getting the Bbox related to the svg with the id SVG_CANVAS_DISPLAY_ID
    // cf Bbox documentation above for more details.
    const bbox = SVGElContainer?.getBBox?.();

    if (bbox) {
      // Handling Bbox error that can occur if element is not yet in the DOM for example
      // -9999 values means most likely something went wrong.
      if (bbox.x !== -9999 && bbox.y !== -9999) {
        setSVGBbbox(`${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        setSVGDimensions({ height: bbox.height, width: bbox.width });
      }
    }
    // We need to enforce the computation when children changes
  }, [SVGElContainer, children]);

  const handleSetviewBox = () => {
    const bbox = SVGElContainer?.getBBox?.();

    if (bbox) {
      if (bbox.x !== -9999 && bbox.y !== -9999) {
        setSVGBbbox(`${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        setSVGDimensions({ height: bbox.height, width: bbox.width });
      }
    }
  };

  const onZoomStop = React.useCallback((ref: ReactZoomPanPinchRef) => {
    setIsPanningDisabled(ref.state.scale <= 1);
  }, []);

  const correctedHeight = (SVGDimensions.height / SVGDimensions.width) * width;
  return (
    <TransformWrapper
      initialScale={1}
      onZoomStop={onZoomStop}
      panning={{ disabled: isPanningDisabled }}
    >
      <TransformComponent>
        <div
          style={{
            height: correctedHeight,
            width,
          }}
        >
          <svg
            id="svg-canvas-display"
            style={{ maxWidth: '100%' }}
            version="1.1"
            {...(SVGBbbox ? { viewBox: SVGBbbox } : {})}
            xmlns="http://www.w3.org/2000/svg"
          >
            {children}
          </svg>
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
};

export default React.memo(CanvasSvgDisplayOnly);
