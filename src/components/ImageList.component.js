// @flow

import React from 'react';

import { withStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/DeleteForever';

type Props = {
  onRemoveImage: (number) => void,
  images: *[],

  classes: Object,
};

export function ImageList(props: Props) {
  const { images, onRemoveImage, classes } = props;
  return (
    <div className={classes.container}>
      {images.map((image) => (
        <div className={classes.imagePreview} key={image.id}>
          <Button
            size="small"
            className={classes.imageRemove}
            aria-label="Remove"
            onClick={(e) => {
              e.preventDefault();
              onRemoveImage(image.id);
            }}
          >
            <DeleteIcon />
          </Button>
          <img alt="preview" src={image.image} className={classes.image} />
        </div>
      ))}
    </div>
  );
}

const styles = (theme) => ({
  container: {
    overflowX: 'scroll',
    display: 'flex',
    flexFlow: 'row no-wrap',
  },
  imagePreview: {
    position: 'relative',
    minWidth: 220,
    textAlign: 'center',
    boxSizing: 'content-box',
    backgroundColor: '#F6f6f6',
    border: '1px solid #e1e1e1',
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    height: theme.spacing.unit * 15,
    width: theme.spacing.unit * 15 * 1.618,
  },
  image: {
    objectFit: 'contain',
    maxHeight: theme.spacing.unit * 15,
    maxWidth: theme.spacing.unit * 15 * 1.618,
  },
  imageRemove: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
export default withStyles(styles)(ImageList);
