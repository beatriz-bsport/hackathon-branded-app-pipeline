import React from 'react';
import LoginWithDisconnectedStatusWidget, {
  OwnProps as LoginWithDisconnectedStatusOwnProps,
} from '../widgets/LoginWithDisconnectedStatus.widget';

export default function withLoginDisconnectedStatusHOC<P>(
  Component: React.ComponentType<P>,
) {
  return React.memo((props: P & LoginWithDisconnectedStatusOwnProps) => {
    const {
      companyId,
      config,
      dialogMode,
      parentElement,
      isBackofficePreview,
    } = props;
    return (
      <LoginWithDisconnectedStatusWidget
        companyId={companyId}
        config={config}
        dialogMode={dialogMode}
        parentElement={parentElement}
        isBackofficePreview={isBackofficePreview}
      >
        <Component {...props} />
      </LoginWithDisconnectedStatusWidget>
    );
  });
}
