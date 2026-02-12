import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core';

type UserInteractionModalProps = {
  url: string;
};

const InPageInteractionPortal: React.FC<UserInteractionModalProps> = ({
  url,
}) => {
  const classes = useModalStyles({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (url) {
      containerRef.current?.scrollIntoView({
        block: 'start',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [url]);

  return (
    <div className={classes.container} ref={containerRef}>
      <iframe
        title="bsport-inner-modal"
        className={classNames(
          classes.iframe,
          'bsport-user-interaction-modal__iframe',
        )}
        src={url}
        allow="payment"
      />
    </div>
  );
};

const useModalStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    overflow: 'hidden',
    width: '100%',
    zIndex: 1000,
    minHeight: '1000px',
    scrollMarginTop: '40px',
  },
  iframe: {
    flex: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
}));

export default InPageInteractionPortal;
