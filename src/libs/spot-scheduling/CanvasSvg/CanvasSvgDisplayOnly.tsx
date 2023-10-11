import React from 'react';

const SVG_CANVAS_DISPLAY_ID = 'svg-canvas-display';
// https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getBBox
const CanvasSvgDisplayOnly: React.FC = ({
  children,
}: {
  children: SVGElement;
}) => {
  const [SVGElContainer, setSVGElContainer] =
    React.useState<SVGGraphicsElement>(null);

  const [SVGBbbox, setSVGBbbox] = React.useState('');

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
      bbox.x !== -9999 &&
        bbox.y !== -9999 &&
        setSVGBbbox(`${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
    }
    // We need to enforce the computation when children changes
  }, [SVGElContainer, children]);

  const handleSetviewBox = () => {
    const bbox = SVGElContainer?.getBBox?.();

    if (bbox) {
      bbox.x !== -9999 &&
        bbox.y !== -9999 &&
        setSVGBbbox(`${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
    }
  };

  return (
    <svg
      id="svg-canvas-display"
      style={{ maxWidth: '100%' }}
      version="1.1"
      {...(SVGBbbox ? { viewBox: SVGBbbox } : {})}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};

export default React.memo(CanvasSvgDisplayOnly);
