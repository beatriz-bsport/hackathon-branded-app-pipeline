import React, { useRef, useState, useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteIcon from '@material-ui/icons/DeleteForever';

export type Props = {
  selectedImage: number | null;
  imagesArr: Array<string>;
  handleClick: (index: number) => void;
  onRemoveImage?: (index: number) => void;
  isManager: boolean;
  title?: string;
};

export const CarouselInput = (props: Props) => {
  const {
    imagesArr,
    onRemoveImage,
    title,
    selectedImage,
    handleClick,
    isManager,
  } = props;
  const classes = useStyles();

  const ref = useRef();
  const [scrollLeft, setScrollLeft] = useState(ref?.current?.scrollLeft);

  const updateCarousel = (isLeftButton: boolean) => {
    isLeftButton
      ? setScrollLeft(ref?.current?.scrollLeft - 150)
      : setScrollLeft(ref?.current?.scrollLeft + 150);

    if (ref?.current?.scrollLeft >= 0) {
      ref.current.scrollTo({
        left: isLeftButton
          ? ref.current.scrollLeft - 150
          : ref.current.scrollLeft + 150,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    setScrollLeft(ref?.current?.scrollLeft);
  }, []);

  return (
    <div className={classes.container}>
      {!!title && (
        <Typography variant="subtitle1" style={{ fontSize: 16 }}>
          {title}
        </Typography>
      )}
      <div className={classes.carousel}>
        <div className={scrollLeft <= 0 ? classes.hidden : ''}>
          <IconButton
            className={classes.carouselButton}
            onClick={() => updateCarousel(true)}
          >
            <ChevronLeftIcon className={classes.largeIcon} />
          </IconButton>
        </div>
        <div ref={ref} className={classes.imageCarousel}>
          {imagesArr.map((cardImage, index) => {
            return (
              <div
                className={index === selectedImage ? classes.outlined : ''}
                key={cardImage}
              >
                <div className={classes.imagePreview}>
                  {isManager && (
                    <IconButton
                      size="small"
                      className={classes.deleteIcon}
                      aria-label="delete"
                      onClick={() => {
                        onRemoveImage(index);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  <div
                    onClick={() => {
                      handleClick(index);
                    }}
                    aria-hidden="true"
                    className={classes.onClick}
                  >
                    <img
                      alt={`preview #${index}`}
                      src={cardImage}
                      className={classes.image}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div
          className={
            scrollLeft >= ref?.current?.scrollLeftMax ? classes.hidden : ''
          }
        >
          <IconButton
            className={classes.carouselButton}
            onClick={() => updateCarousel(false)}
          >
            <ChevronRightIcon className={classes.largeIcon} />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  carousel: {
    display: 'flex',
    alignItems: 'center',
  },
  imageCarousel: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
    overflowX: 'hidden',
  },
  imagePreview: {
    position: 'relative',
    backgroundColor: '#F6f6f6',
    border: '1px solid #e1e1e1',
    height: '102px',
    width: '102px',
  },
  image: {
    maxHeight: '100px',
    width: '100%',
  },
  deleteIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: '#DCDCDC',
    },
  },
  outlined: {
    border: '3px solid #FFA71D',
    width: 'auto',
  },
  largeIcon: {
    width: 50,
    height: 50,
  },
  carouselButton: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  hidden: {
    visibility: 'hidden',
    display: 'flex',
    alignItems: 'center',
  },
  onClick: {
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
  },
}));

export default CarouselInput;
