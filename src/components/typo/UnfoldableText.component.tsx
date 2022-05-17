import React, { useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ButtonBase, makeStyles, Theme } from '@material-ui/core';

const UnfoldableText: React.FC<{
  text: string;
  maxLines: number;
  className?: string;
  id?: string;
  ids?: {
    button?: string;
  };
}> = ({ text, maxLines, className, id, ids }) => {
  const { t } = useTranslation(['common']);
  const classes = useStyles();

  const [textRef, setTextRef] = useState<HTMLDivElement>(null);
  const [denseHeight, setDenseHeight] = useState(null);
  const [isOpen, setisOpen] = useState(false);

  useLayoutEffect(() => {
    if (textRef?.clientHeight && !denseHeight) {
      setDenseHeight(textRef?.clientHeight);
    }
  }, [textRef, denseHeight]);

  const getHeight = () => {
    if (isOpen) {
      return textRef?.scrollHeight;
    }

    if (denseHeight) {
      return denseHeight;
    }

    return textRef?.clientHeight;
  };

  return (
    <>
      <div
        ref={(ref) => {
          setTextRef(ref);
        }}
        style={{
          ...(!isOpen
            ? {
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: `${maxLines}`,
              }
            : {}),
          height: getHeight(),
          overflow: 'hidden',
          transition: 'all 0.3s ease-out',
        }}
        className={className}
        id={id}
      >
        {text}
      </div>
      {denseHeight < textRef?.scrollHeight && (
        <ButtonBase
          onClick={() => {
            setisOpen(!isOpen);
          }}
          className={classes.showMore}
          id={ids?.button}
        >
          {t(isOpen ? 'text.showLessText' : 'text.showMoreText')}
        </ButtonBase>
      )}
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  showMore: {
    fontSize: 12,
    color: theme.palette.text.secondary,
  },
}));

export default UnfoldableText;
