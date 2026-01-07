// @debt - we should whitelist the origins of messages sent in this file

const getParentElement = () =>
  window.opener ?? (window.parent !== window ? window.parent : null);

export const getBridgeIframe = () =>
  document.getElementById(
    '@bsport-proxy-bridge-iframe',
  ) as HTMLIFrameElement | null;

export const sendBridgeMessageWithRetry = async (data?: any) => {
  const maxRetries = 10;
  let retries = 0;
  while (retries < maxRetries) {
    const iframe = getBridgeIframe();
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, '*');
      return;
    }
    retries++;

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error('Proxy bridge iframe not found');
};

export const sendBridgeMessage = (data?: any) => {
  const iframe = getBridgeIframe();

  if (!iframe || !iframe.contentWindow) {
    throw new Error('Proxy bridge iframe not found');
  }

  try {
    iframe.contentWindow.postMessage(data, '*');
  } catch (err) {
    console.error(err);
  }
};

export const sendParentMessage = (data?: any) => {
  const parentElement = getParentElement();

  if (!parentElement) {
    throw new Error('Proxy bridge iframe not found');
  }

  try {
    parentElement.postMessage(data, '*');
  } catch (err) {
    console.error(err);
  }
};

export const broadcastToAllWidgets = (data?: any) => {
  window.postMessage(data, '*');
};

export const shouldUseBridge = () => !!getBridgeIframe();
