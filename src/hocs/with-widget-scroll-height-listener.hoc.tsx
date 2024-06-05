import React from 'react';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

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

export default withScrollHeightListener;
