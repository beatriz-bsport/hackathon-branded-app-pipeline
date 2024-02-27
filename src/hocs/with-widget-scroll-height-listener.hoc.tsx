import React from 'react';
import WidgetUtils from '#libs/widget/WidgetUtils';
// import useParentSize from '#hooks/useParentSize';

const sendPostMessageUpdate = (height: number) => {
  if (WidgetUtils.isWidget() && !!WidgetUtils.getParentElementId()) {
    const message = {
      type: 'bsport-widget-resize',
      data: {
        scrollHeight: height,
        parentElementId: WidgetUtils.getParentElementId(),
      },
    };
    window?.parent?.postMessage(message, '*');
  }
};

const withScrollHeightListener = (
  WrappedComponent: React.ComponentType<any>,
) => {
  return (props: any) => {
    const containerRef = React.useRef(null);

    React.useEffect(() => {
      const intervalId = setInterval(() => {
        sendPostMessageUpdate(containerRef?.current?.clientHeight);
      }, 500);

      return () => {
        clearInterval(intervalId);
      };
    });

    return <WrappedComponent {...props} containerRef={containerRef} />;
  };
};

// const withScrollHeightListener = (
//   WrappedComponent: React.ComponentType<any>,
// ) => {
//   return (props: any) => {
//     const containerRef = React.useRef(null);

//     // @ts-expect-error
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { _, height } = useParentSize(containerRef, {
//       maxDifference: 150,
//     });

//     React.useEffect(() => {
//       const intervalId = setInterval(() => {
//         sendPostMessageUpdate(containerRef?.current?.clientHeight);
//       }, 500);

//       return () => {
//         clearInterval(intervalId);
//       };
//     });

//     sendPostMessageUpdate(height);

//     return <WrappedComponent {...props} containerRef={containerRef} />;
//   };
// };
export default withScrollHeightListener;
